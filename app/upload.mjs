/**
 * x402 Upload Script — Production
 * Handles the full 402 → sign → retry payment flow via @x402/fetch.
 *
 * Setup:
 *   npm install @x402/evm @x402/fetch viem yargs dotenv
 *
 * Usage:
 *   X402_PRIVATE_KEY=<hex> node upload.mjs --command upload
 *   node upload.mjs --command upload --file path/to/image.png
 *   node upload.mjs --command inspect
 *   node upload.mjs --get-nft 93
 *   node upload.mjs --env .env --command upload
 */
import { readFile } from "fs/promises";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { registerExactEvmScheme } from "@x402/evm/exact/client";
import { x402Client, wrapFetchWithPayment } from "@x402/fetch";
import { privateKeyToAccount, mnemonicToAccount } from "viem/accounts";
import dotenv from "dotenv";

const GREEN_SQUARE_PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAD0lEQVR4nGNg+M8AQhAKABvyA/1tVLjHAAAAAElFTkSuQmCC";

const argv = yargs(hideBin(process.argv))
  .option("file", {
    type: "string",
    describe: "Path to image file (overrides built-in green square)",
  })
  .option("env", {
    type: "string",
    describe: "Path to .env file to load",
  })
  .option("get-nft", {
    type: "string",
    describe: "GET /nfts/{i} – fetch NFT URL by token ID (e.g. 93)",
  })
  .option("command", {
    alias: "cmd",
    type: "string",
    choices: ["upload", "get", "inspect"],
    describe:
      "Command: upload (pay & upload), inspect (raw 402 response without payment), get (alias for --get-nft)",
  })
  .help()
  .parse();

if (argv.env) {
  dotenv.config({ path: argv.env });
}

const API_BASE = "https://api.nftitem.io";
const UPLOAD_PATH = "/upload";

function getUploadSigner() {
  let privateKey = process.env.X402_PRIVATE_KEY;
  if (privateKey && typeof privateKey === "string" && privateKey.trim()) {
    const hexKey = privateKey.trim().startsWith("0x")
      ? privateKey.trim()
      : `0x${privateKey.trim()}`;
    return privateKeyToAccount(hexKey);
  }
  const mnemonic = process.env.X402_MNEMONIC;
  if (mnemonic && typeof mnemonic === "string" && mnemonic.trim()) {
    return mnemonicToAccount(mnemonic.trim());
  }
  throw new Error(
    "UPLOAD requires X402_PRIVATE_KEY or X402_MNEMONIC in env or .env file"
  );
}

export async function uploadWithPayment({
  content,
  contentType = "image/png",
}) {
  const signer = getUploadSigner();
  const client = new x402Client();
  registerExactEvmScheme(client, { signer });
  const fetchWithPayment = wrapFetchWithPayment(fetch, client);

  const url = `${API_BASE}${UPLOAD_PATH}`;
  const body = JSON.stringify({
    command: "UPLOAD",
    data: { content, contentType },
  });

  console.log(`Uploading to: ${url}`);

  const response = await fetchWithPayment(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  const data = await response.json().catch(() => ({}));
  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}

export async function inspectUpload({ content, contentType = "image/png" }) {
  const url = `${API_BASE}${UPLOAD_PATH}`;
  const body = JSON.stringify({
    command: "UPLOAD",
    data: { content, contentType },
  });

  console.log(`Inspecting (no payment): ${url}`);

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  const headers = Object.fromEntries(response.headers.entries());
  const data = await response.json().catch(() => ({}));
  return {
    ok: response.ok,
    status: response.status,
    headers,
    data,
  };
}

const NFTS_PATH = "/nfts";

export async function getNftUrl({ tokenId }) {
  const id = Number(tokenId);
  if (!Number.isFinite(id)) {
    throw new Error(`Invalid tokenId: ${tokenId}`);
  }
  const url = `${API_BASE}${NFTS_PATH}/${id}`;
  const response = await fetch(url, { method: "GET" });
  const data = await response.json().catch(() => ({}));
  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}

async function run() {
  const getNftId = argv["get-nft"];
  const cmd = argv.command;
  if (cmd === "get" && !getNftId) {
    console.error("--command get requires --get-nft <tokenId>");
    process.exit(1);
  }
  if (getNftId) {
    const result = await getNftUrl({ tokenId: getNftId });
    console.log("GET /nfts/" + getNftId + " status:", result.status);
    console.log("data:", JSON.stringify(result.data, null, 2));
    if (!result.ok) {
      throw new Error(`GET nft failed: ${result.status}`);
    }
    console.log("OK – url:", result.data?.url);
    return;
  }

  let content;
  if (argv.file) {
    const buf = await readFile(argv.file);
    content = buf.toString("base64");
  } else {
    content = GREEN_SQUARE_PNG_BASE64;
  }

  if (cmd === "inspect") {
    const result = await inspectUpload({ content, contentType: "image/png" });
    console.log("status:", result.status);
    console.log("headers:", JSON.stringify(result.headers, null, 2));
    console.log("data:", JSON.stringify(result.data, null, 2));
    return;
  }

  const result = await uploadWithPayment({
    content,
    contentType: "image/png",
  });

  console.log("status:", result.status);
  console.log("data:", JSON.stringify(result.data, null, 2));

  if (!result.ok) {
    throw new Error(`Upload failed: ${result.status}`);
  }
  console.log("OK");
}

run().catch(err => {
  console.error(err.response?.data ?? err.message);
  process.exit(1);
});
