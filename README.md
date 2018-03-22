[![Build Status](https://travis-ci.org/blockchain/blockchain-wallet-v4-frontend.svg?branch=master)](https://travis-ci.org/blockchain/blockchain-wallet-v4-frontend) 
[![Coverage Status](https://coveralls.io/repos/github/blockchain/blockchain-wallet-v4-frontend/badge.svg)](https://coveralls.io/github/blockchain/blockchain-wallet-v4-frontend)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)

# Blockchain Wallet v4
Be Your Own Bank at [blockchain.info/wallet](https://blockchain.info/wallet). 
Please [contact support](https://support.blockchain.com) if you have any issues using the wallet.

## About
This repo contains the three codebases/packages listed below that are combined into one via [Lerna](https://github.com/lerna/lerna).

### Packages
 * [blockchain-info-components](./packages/blockchain-info-components) The shared UI components library.
 * [blockchain-wallet-v4](./packages/blockchain-wallet-v4) The functional library for handling wallets.
 * [blockchain-wallet-v4-frontend](./packages/blockchain-wallet-v4-frontend) The frontend application built with React/Redux.


## Local Development
1. Ensure `npm@5` is installed. Node version >= 8.0.0
2. Ensure `lerna` and `yarn` are installed globally: `npm install -g lerna yarn`
3. Install and link packages: `yarn && lerna bootstrap`
4. Start application in dev mode: `yarn start`
5. The frontend will now be accessible via browser at `localhost:8080`

### Important Notes
1. After installing or uninstalling a NPM package, run the following node command at the root of the project:
   * `lerna bootstrap`
2. All developer specific dependencies should be installed in the top level `package.json`. This helps reduce duplicate 
    packages as well as speed up build times.
   * `yarn i --save-dev [package-name]`
3. To test bitcoin handling in dev mode: run this javascript command in the browser console:
   * `window.navigator.registerProtocolHandler('bitcoin', http://localhost:8080/a/%s, 'Blockchain')`

### Useful Chrome Extensions
 * [React Developer Tools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en) Inspect the React component tree
 * [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en) View/debug Redux state changes


## Production Builds
To build the frontend application for production: `npm run build:prod`


## Code Quality
### Linting
We follow the rules outlined by the [Javascript Standard Style](https://standardjs.com/rules.html) as well as a few React specfic rules.
 
Code linting is handled by [ESLint](https://eslint.org/). The following commands are available:
 * `yarn lint` Lints all packages
 * `yarn lint:components` Lints only [blockchain-info-components](./packages/blockchain-info-components)
 * `yarn lint:core` Lints only [blockchain-wallet-v4](./packages/blockchain-wallet-v4)
 * `yarn lint:frontend` Lints only [blockchain-wallet-v4-frontend](./packages/blockchain-wallet-v4-frontend)
 * `yarn lint:fix` Automatically resolves fixable issues via ESLint

These IDE plugins/packages assist with complying with these lint rules while developing:
 * [Atom](https://atom.io/packages/linter-js-standard)
 * [VS Code](https://marketplace.visualstudio.com/items?itemName=chenxsan.vscode-standardjs)
 * [WebStorm](https://blog.jetbrains.com/webstorm/2017/04/using-javascript-standard-style/)

### Unit Tests
Testing is done via [Jest](https://facebook.github.io/jest/) and [Enzyme](http://airbnb.io/enzyme/).

#### Running Tests
 * `yarn test` Runs unit tests for all packages
 * `yarn test:components` Runs unit tests for only [blockchain-info-components](./packages/blockchain-info-components)
 * `yarn test:core` Runs unit tests for only [blockchain-wallet-v4](./packages/blockchain-wallet-v4)
 * `yarn test:frontend` Runs unit tests for only [blockchain-wallet-v4-frontend](./packages/blockchain-wallet-v4-frontend)
 
#### Running Tests via Watch
 * `yarn test:watch` Watches and then runs desired tests
 * `yarn test:components:watch` Watches and then runs desired tests for only [blockchain-info-components](./packages/blockchain-info-components)
 * `yarn test:core:watch` Watches and then runs desired tests for only [blockchain-wallet-v4](./packages/blockchain-wallet-v4)
 * `yarn test:frontend:watch` Watches and then runs desired tests for only [blockchain-wallet-v4-frontend](./packages/blockchain-wallet-v4-frontend)

#### Debugging Tests
To enable debugging for unit tests via the Chrome browser, run the following commands:
 * `yarn test:components:debug` Debugs unit tests for only [blockchain-info-components](./packages/blockchain-info-components)
 * `yarn test:core:debug` Debugs unit tests for only [blockchain-wallet-v4](./packages/blockchain-wallet-v4)
 * `yarn test:frontend:debug` Debugs unit tests for only [blockchain-wallet-v4-frontend](./packages/blockchain-wallet-v4-frontend)

After running one of the above commands, Node will wait for a debugger to attach before starting the tests.
To attach, simply open your browser and go to `chrome://inspect` and click on "Open Dedicated DevTools for Node", 
which will give you a list of available node instances you can connect to. Click on the address displayed in the terminal 
(usually localhost:9229) and you will be able to debug tests using Chrome's DevTools.

#### Updating Snapshot Tests
We are snapshot testing UI some components. Here are the commands to update them when necessary:
 * `yarn test:components:update` Updates component snapshots for only [blockchain-info-components](./packages/blockchain-info-components)
 * `yarn test:frontend:update` Updates component snapshots for only [blockchain-wallet-v4-frontend](./packages/blockchain-wallet-v4-frontend)


### Code Coverage
To generate code coverage reports via [Istanbul](https://istanbul.js.org/), the following commands are available:
 * `yarn coverage` Generates a coverage report for all packages
 * `yarn coverage:components` Generates coverage report for only [blockchain-info-components](./packages/blockchain-info-components)
 * `yarn coverage:core` Generates coverage report for only [blockchain-wallet-v4](./packages/blockchain-wallet-v4)
 * `yarn coverage:frontend` Generates coverage report for only [blockchain-wallet-v4-frontend](./packages/blockchain-wallet-v4-frontend)

Depending upon which coverage report was ran, the results can be found in the following directories:
 * `coverage/index.html`
 * `coverage/blockchain-info-components/index.html`
 * `coverage/blockchain-wallet-v4/index.html`
 * `coverage/blockchain-wallet-v4-frontend/index.html`

Simply open the `index.html` file in your browser to view.

### CI Build Vetting
To run both unit tests and linting, the following commands are available:
 * `yarn vet` Lints and unit tests all packages
 * `yarn vet:components` Lints and unit tests only [blockchain-info-components](./packages/blockchain-info-components)
 * `yarn vet:core` Lints and unit tests only [blockchain-wallet-v4](./packages/blockchain-wallet-v4)
 * `yarn vet:frontend` Lints and unit tests only [blockchain-wallet-v4-frontend](./packages/blockchain-wallet-v4-frontend)
 
 
## Storybook
[Storybook](https://github.com/storybooks/storybook) is used by the [blockchain-info-components](./packages/blockchain-info-components) package to interactively view, develop and test components.  
The following commands are available:
 * `storybook:build`: Builds the static storybook assets
 * `storybook:serve` Builds storybook assets and then serves them locally at `localhost:6006`

## Contribute
Bug fixes and feedback on our code is always appreciated.


## Security
Security issues can be reported to us in the following venues:

* Email: security@blockchain.info
* Bug Bounty: https://hackerone.com/blockchain
