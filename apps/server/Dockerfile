FROM node:23-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*

RUN npm install --only=development --silent

COPY . .

RUN npx nx build server --prod

FROM node:23-alpine AS runner

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/apps/server/dist/package*.json ./

RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*

RUN npm install -g pm2@latest

RUN npm install --only=production --silent

COPY --from=builder /usr/src/app/apps/server/dist ./

EXPOSE 3000

ENTRYPOINT ["pm2-runtime","main.js"]