# V4-Wallet-Frontend

## Prerequisites
* Java SDK

## Guidelines

1. [Development](../master/help/Development.md)
1. [Localization](../master/help/Localization.md)
1. [Components](../master/help/Components.md)
1. [Style](../master/help/Style.md)
1. [Tests](../master/help/Tests.md)

## Commands

1. `yarn install --ignore-engines`: restore the npm dependencies
2. `yarn build-dev`: build the project in development mode (testnet)
3. `yarn build-prod`: build the project in production mode (bitcoin)
4. `yarn start-dev`: start the website on http://localhost:8080 in development mode
5. `yarn start-prod`: start the website on http://localhost:8080 in production mode
6. `yarn generate`: generate locales/en.json by computing all key/values used in the solution (DEPRECATED)

## Development mode

1. `cd dream-wallet && yarn link`
2. `cd dream-wallet-frontend && yarn link dream-wallet`
3. `cd dream-wallet && yarn run watch`
