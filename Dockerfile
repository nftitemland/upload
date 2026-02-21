FROM node:22-slim

WORKDIR /app

COPY app/package.json ./
RUN npm install --omit=dev

COPY app/upload.mjs ./

ENTRYPOINT ["node", "upload.mjs"]
CMD ["--command", "upload"]
