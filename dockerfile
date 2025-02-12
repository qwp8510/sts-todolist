FROM node:21-alpine AS builder

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:21-alpine
WORKDIR /app

COPY --from=builder /app/dist ./dist

COPY --from=builder /app/public ./dist/public

COPY --from=builder /app/dist/migration ./dist/migration

COPY --from=builder /app/node_modules ./node_modules

CMD ["node", "dist/src/main.js"]
