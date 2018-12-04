FROM node:10.12.0-alpine

ADD dist-api app
ADD api/.env.production app/.env.production

ADD yarn.lock app/yarn.lock
ADD package.json app/package.json
ADD turtle-config.json app/turtle-config.json
ADD dist-client app/dist-client

ENV NODE_ENV=production

WORKDIR /app

EXPOSE 4000

RUN yarn install --production

CMD ["node_modules/.bin/env-cmd", ".env.production", "node", "api/index.js"]
