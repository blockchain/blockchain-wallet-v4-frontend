# Blockchain Wallet

Collection of Blockchain Wallet frontend packages.

## Packages

- [blockchain-info-components](./packages/blockchain-info-components)
- [blockchain-wallet-v4](./packages/blockchain-wallet-v4)
- [blockchain-wallet-v4-frontend](./packages/blockchain-wallet-v4-frontend)

## Development

⚠️ Make sure you have `npm@5` and `lerna` installed

1. Install and link packages: `npm i && lerna bootstrap`
2. Start application in dev mode: `npm start`
3. Build frontend for production: `npm run build:prod`

Notes: 
1. After installing or uninstalling a NPM package, run the following node command at the root of the project:
* `lerna bootstrap`
2. To test bitcoin handling in dev mode: run this javascript command in the browser console:
* `window.navigator.registerProtocolHandler('bitcoin', http://localhost:8080/a/%s, 'Blockchain')`
