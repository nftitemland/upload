# ⛓️ Upload to the Blockchain

```
 ██████╗  █████╗ ████████╗ █████╗      ██╗
 ██╔══██╗██╔══██╗╚══██╔══╝██╔══██╗    ██╔╝
 ██║  ██║███████║   ██║   ███████║   ██╔╝
 ██║  ██║██╔══██║   ██║   ██╔══██║  ██╔╝
 ██████╔╝██║  ██║   ██║   ██║  ██║ ██╔╝
 ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝
    your data. on-chain. forever. 🌐
```

> Upload your data to the **Base blockchain** 🔵 — permanently stored in on-chain events, linked to a minted NFT, and viewable on **[nftitem.io](https://nftitem.io)** ✨

---

## 🧠 How It Works

```
  you                api.nftitem.io            Base blockchain
  ───                ──────────────            ───────────────
   │                       │                         │
   │  POST /upload 🚀       │                         │
   │──────────────────────▶│                         │
   │                       │  createDataUploadSession │
   │   💳 x402 payment     │ ───────────────────────▶│
   │◀──────────────────────│                         │
   │  sign & retry         │  appendData (chunks) 📦 │
   │──────────────────────▶│ ───────────────────────▶│
   │                       │  finalizeSession → mint  │
   │                       │ ───────────────────────▶│
   │      ✅ NFT minted!   │                         │
   │◀──────────────────────│       🪙 token lives    │
                                    on-chain forever
```

Your data is uploaded in **chunks** via a **data upload session**, then finalized — which **mints an NFT** with your data embedded in on-chain events. Metadata (including the SVG image) is generated **fully on-chain** in `tokenURI()`. 🎨

---

## 📜 The Contract

| | |
|---|---|
| **Contract** | `NFTItemBlockchainData` |
| **Ticker** | `NIBD` |
| **Chain** | Base 🔵 |
| **Address** | [`0x3e2973bb0d96eddbdcc2279575a135e10e63a48c`](https://basescan.org/address/0x3e2973bb0d96eddbdcc2279575a135e10e63a48c) |
| **View NFTs** | [nftitem.io](https://nftitem.io) 🌐 |

---

## 🎨 NFT Images

Choose your NFT's look when you finalize your upload session:

| # | Name | Max Supply |
|---|---|---|
| 0 | ✨ Giga Rare Item | ∞ unlimited |
| 1 | 🐶 Yorkshire | 1,000 |
| 2 | 🐕 Doge | 1,000 |
| 3 | 🪆 Terracotta Boto with Bitcoin Bib | 1,690,000 |
| 4 | 🟦 Squr | 100 |
| 5 | 🐔 Tamachi | 690 |
| 6 | 🗺️ Map | 10,000,000 |

---

## ⚡ Quick Start

### 1️⃣ Set your key

Create a `.env` file:
```env
PRIVATE_KEY=your_private_key_here
# or X402_PRIVATE_KEY=...
# or X402_MNEMONIC=your twelve word phrase here
```

### 2️⃣ Run with Docker 🐳

```bash
# Upload the built-in test image (green square 🟩)
docker compose up

# Upload your own file 🖼️
docker compose run --rm upload --command upload --file /data/myfile.png

# Inspect the 402 payment challenge without paying 🔍
docker compose run --rm upload --command inspect

# Fetch an NFT's data by token ID 🪙
docker compose run --rm upload --get-nft 93
```

### 3️⃣ Or run directly with Node 🟢

```bash
cd app
npm install
node upload.mjs --command upload
node upload.mjs --command upload --file path/to/file.png
node upload.mjs --command inspect
node upload.mjs --get-nft 93
```

---

## 🛠️ Commands

| Flag | What it does |
|---|---|
| `--command upload` | 💸 Pay via x402 & upload your data |
| `--command inspect` | 🔍 See the 402 challenge without paying |
| `--command get` | 🪙 Alias for `--get-nft` |
| `--get-nft <id>` | 📡 Fetch a minted NFT's URL by token ID |
| `--file <path>` | 🖼️ Upload a custom file |
| `--env <path>` | 🗝️ Load a custom .env file |

---

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `PRIVATE_KEY` | 🔑 Wallet private key (hex) |
| `X402_PRIVATE_KEY` | 🔑 Same — x402-style name |
| `X402_MNEMONIC` | 📜 12-word seed phrase |

> 💡 `PRIVATE_KEY` and `X402_PRIVATE_KEY` are interchangeable!

---

## 🐳 Docker Volume

Mount your files at `/data` inside the container:

```yaml
volumes:
  - ./images:/data
```

---

## 🌐 Powered By

- 🔵 **[Base](https://base.org)** — Ethereum L2 by Coinbase
- 💳 **[x402](https://x402.org)** — HTTP 402 native payment protocol
- 🔷 **[viem](https://viem.sh)** — TypeScript Ethereum library
- 🟢 **Node.js 22** — latest & greatest
- 🌐 **[nftitem.io](https://nftitem.io)** — view your on-chain data

---

```
  ～( ˘▾˘)～  your data lives on-chain forever  ～(˘▾˘ )～
                     made with 💖 by nftitem.io
```
