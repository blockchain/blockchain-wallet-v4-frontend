# Blockchain-Wallet-v4-Frontend

## Prerequisites
* Java SDK

## Guidelines

1. [Development](../master/help/Development.md)
1. [Localization](../master/help/Localization.md)
1. [Style](../master/help/Style.md)
1. [Tests](../master/help/Tests.md)

## Installation

1. Install the blockchain-wallet-v4 project
* Clone `https://github.com/blockchain/blockchain-wallet-v4`
* Execute `yarn install`
* Execute `yarn link`
* Execute `yarn watch`

2. Install the blockchain-info-components project
* Clone `https://github.com/blockchain/blockchain-info-components`
* Execute `yarn install`
* Execute `yarn link`
* Execute `yarn watch`

3. Configure the blockchain-wallet-v4-frontend
* Clone `https://github.com/blockchain/blockchain-wallet-v4-frontend`
* Execute `yarn install`
* Execute `yarn link blockchain-wallet-v4`
* Execute `yarn link blockchain-info-components`
* Execute `yarn start-dev`

## Commands

1. `yarn install`: restore the npm dependencies
2. `yarn build-dev`: build the project in development mode (testnet)
3. `yarn build-prod`: build the project in production mode (bitcoin)
4. `yarn start-dev`: start the website on http://localhost:8080 in development mode
5. `yarn start-prod`: start the website on http://localhost:8080 in production mode
6. `yarn generate`: generate locales/en.json by computing all key/values used in the solution (DEPRECATED)
