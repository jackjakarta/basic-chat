FROM node:22.8.0-slim

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

RUN npm install -g pnpm@9.15.3 && \
    pnpm i

COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
