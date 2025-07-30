FROM node:23-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*

RUN npm install --force

COPY . .

# Install missing Rollup dependency for ARM64
RUN npm install @rollup/rollup-linux-arm64-musl --save-optional

RUN npx nx build client --prod

FROM nginx:stable-alpine AS runner

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /usr/src/app/apps/client/dist ./

RUN sed -i '10i \\ttry_files $uri $uri/ /index.html;' /etc/nginx/conf.d/default.conf

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
