FROM node:17-alpine as build

WORKDIR /src
COPY . .
RUN chown -R node /src && npm install && npm run build

FROM caddy

COPY --from=build /src/dist/* /usr/share/caddy/
COPY Caddyfile /etc/caddy