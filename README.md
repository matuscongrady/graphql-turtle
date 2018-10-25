# Requirements
- node
- yarn

# Development

## Commands
yarn dev:client
- start client-side development with hot-reload (entrypoint: client/index.tsx)

yarn dev:api
- start api development with hot reload (entrypoint: api/index.ts)

yarn dev
- this will in parallel:
1. generate typings from graphql queries inside /queries folder, and start watchmode that will recompile them anytime they change
2. start project in dev mode
