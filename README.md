# Requirements
- node
- yarn
- docker

## Commands
yarn dev:client
- start client-side development with hot-reload (entrypoint: client/index.tsx)

yarn dev:api
- start api development with hot reload (entrypoint: api/index.ts)

yarn analyze
- analyze javascript bundle size in production mode

yarn docker:build
- build project (both backaned and frontend) and build docker container

yarn docker:run 
- run previosly built container, mount turtle-config.json (config for graphql-turtle), and map exposed port to host machine

yarn test:docker:dist
- build & run together for debugging purposes
