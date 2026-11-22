# 1. 빌드 단계
FROM node:22-bookworm-slim AS builder

WORKDIR /app

# 로컬 환경과 npm 버전 통일
RUN npm install -g npm@11.19.0

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# 개발용 의존성 제거
RUN npm prune --omit=dev


# 2. 실행 단계
FROM node:22-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]