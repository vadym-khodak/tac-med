FROM node:23-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*

RUN npm install --silent

COPY . .

RUN npm run build

FROM node:23-alpine AS runner

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./

RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*

RUN npm install -g pm2@latest

RUN npm install --only=production --silent

EXPOSE 3000

ENTRYPOINT ["pm2-runtime","dist/main.js"]
