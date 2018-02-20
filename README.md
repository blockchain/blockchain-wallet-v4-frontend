# Blockchain Wallet v4

Collection of Blockchain Wallet frontend packages.

## Packages

- [blockchain-info-components](./packages/blockchain-info-components)
- [blockchain-wallet-v4](./packages/blockchain-wallet-v4)
- [blockchain-wallet-v4-frontend](./packages/blockchain-wallet-v4-frontend)

## Development

1. Ensure `npm@5` is installed. Node version >= 8.0.0
2. Ensure `lerna` is installed: `npm install -g lerna`
3. Install and link packages: `npm i && lerna bootstrap`
4. Start application in dev mode: `npm start`
5. The frontend will now be accessible via browser at `localhost:8080`

Notes: 
1. After installing or uninstalling a NPM package, run the following node command at the root of the project:
* `lerna bootstrap`
2. To test bitcoin handling in dev mode: run this javascript command in the browser console:
* `window.navigator.registerProtocolHandler('bitcoin', http://localhost:8080/a/%s, 'Blockchain')`
3. To build the frontend for production: `npm run build:prod`
