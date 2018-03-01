# Blockchain Wallet v4
Be Your Own Bank at [blockchain.info/wallet](https://blockchain.info/wallet). 
Please [contact support](https://support.blockchain.com) if you have any issues using the wallet.


## Included Packages
* [blockchain-info-components](./packages/blockchain-info-components)
    - The shared UI components library.
* [blockchain-wallet-v4](./packages/blockchain-wallet-v4)
    - The functional library for handling Blockchain.info wallets.
* [blockchain-wallet-v4-frontend](./packages/blockchain-wallet-v4-frontend)
    - The frontend application built with React/Redux.


## Local Development
1. Ensure `npm@5` is installed. Node version >= 8.0.0
2. Ensure `lerna` and `yarn` are installed globally: `npm install -g lerna yarn`
3. Install and link packages: `yarn && lerna bootstrap`
4. Start application in dev mode: `yarn start`
5. The frontend will now be accessible via browser at `localhost:8080`

Notes:
1. After installing or uninstalling a NPM package, run the following node command at the root of the project:
   * `lerna bootstrap`
2. All developer specific dependencies should be installed in the top level `package.json`. This helps reduce duplicate 
    packages as well as speed up build times.
   * `yarn i --save-dev [package-name]`
3. To test bitcoin handling in dev mode: run this javascript command in the browser console:
   * `window.navigator.registerProtocolHandler('bitcoin', http://localhost:8080/a/%s, 'Blockchain')`
   
   
## Production Builds
To build the frontend application for production: `npm run build:prod`


## Code Quality
### Linting
The following commands are available:
 * `yarn lint` Lints all the 3 packages.
 * `yarn lint:components` Lints only [blockchain-info-components](./packages/blockchain-info-components).
 * `yarn lint:core` Lints only [blockchain-wallet-v4](./packages/blockchain-wallet-v4).
 * `yarn lint:frontend` Lints only [blockchain-wallet-v4-frontend](./packages/blockchain-wallet-v4-frontend).

### Unit Tests
The following commands are available:
 * `yarn test` Runs unit tests for all the 3 packages.
 * `yarn test:components` Runs unit test for only [blockchain-info-components](./packages/blockchain-info-components).
 * `yarn test:core` Runs unit test for only [blockchain-wallet-v4](./packages/blockchain-wallet-v4).
 * `yarn test:frontend` Runs unit test for only [blockchain-wallet-v4-frontend](./packages/blockchain-wallet-v4-frontend).

### Code Coverage
To generate code coverage reports, the following commands are available:
 * `yarn coverage` Generates, and merges together, a coverage report for all the 3 packages. 
 * `yarn coverage:components` Generates coverage report for only [blockchain-info-components](./packages/blockchain-info-components).
 * `yarn coverage:core` Generates coverage report for only [blockchain-wallet-v4](./packages/blockchain-wallet-v4).
 * `yarn coverage:frontend` Generates coverage report for only [blockchain-wallet-v4-frontend](./packages/blockchain-wallet-v4-frontend).

Depending upon which coverage report was ran, the results can be found in the following directories:
 * `coverage/index.html`.
 * `coverage/blockchain-info-components/index.html`.
 * `coverage/blockchain-wallet-v4/index.html`.
 * `coverage/blockchain-wallet-v4-frontend/index.html`.

Simply open the `index.html` file in your browser to view.

### CI Build Vetting
To run both unit tests and linting, the following commands are available:
 * `yarn vet` Lints and unit tests all the 3 packages. 
 * `yarn vet:components` Lints and unit tests only [blockchain-info-components](./packages/blockchain-info-components).
 * `yarn vet:core` Lints and unit tests only [blockchain-wallet-v4](./packages/blockchain-wallet-v4).
 * `yarn vet:frontend` Lints and unit tests only [blockchain-wallet-v4-frontend](./packages/blockchain-wallet-v4-frontend).

## Contribute
Bug fixes and feedback on our code is always appreciated.


## Security
Security issues can be reported to us in the following venues:

* Email: security@blockchain.info
* Bug Bounty: https://hackerone.com/blockchain
