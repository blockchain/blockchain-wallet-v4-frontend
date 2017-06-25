# DreamWallet 🌙 Frontend

## Prerequisites
* Java SDK

## Guidelines

1. [Development](../master/help/Development.md)
1. [Localization](../master/help/LocalizationTests.md)
1. [Style](../master/help/Style.md)
1. [Tests](../master/help/Tests.md)

## Commands

1. `yarn install --ignore-engines`: restore the npm dependencies
2. `yarn run build`: build the project
3. `yarn run start`: start the website on http://localhost:8080
4. `yarn run generate`: generate locales/en.json by computing all key/values used in the solution

## Development mode

1. `cd dream-wallet && yarn link`
2. `cd dream-wallet-frontend && yarn link dream-wallet`
3. `cd dream-wallet && yarn run watch`
