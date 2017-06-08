## Dream Wallet Front-end

# Prerequisites
* Java SDK

# Commands

1. `yarn install`: restore the npm dependencies
2. `yarn run build`: build the project
3. `yarn run start`: start the website on http://localhost:8080

# Development mode

Since `dream-wallet` is not published as an npm package yet, when you install the frontend the dream-wallet transpiled files are not build properly.

For now, the only way to make it work is cloning `dream-wallet` locally too.

1. `cd dream-wallet && npm link`
2. `cd dream-wallet-frontend && npm link dream-wallet`
3. `cd dream-wallet && npm run watch`

# Todo

1. use yarn for `dream-wallet`
2. use yarn instead of npm-link?

