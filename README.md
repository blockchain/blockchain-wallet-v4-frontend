[![Build Status](https://travis-ci.org/blockchain/blockchain-wallet-v4-frontend.svg?branch=master)](https://travis-ci.org/blockchain/blockchain-wallet-v4-frontend)
[![Coverage Status](https://coveralls.io/repos/github/blockchain/blockchain-wallet-v4-frontend/badge.svg?branch=development)](https://coveralls.io/github/blockchain/blockchain-wallet-v4-frontend?branch=development)
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
1. Ensure Node version >= 8.0 is installed
2. Run the following command to install necessary global packages: `npm install -g lerna yarn babel-cli`
3. Install, link and hoist packages: `yarn bootstrap`
4. Start the application in development mode: `yarn start`
5. The frontend application will now be accessible via browser at `localhost:8080`

### Tips & Useful Commands
1. To completely remove all dependencies and artifacts run `yarn clean`
2. After installing or uninstalling a NPM package, run `yarn bootstrap` to re-init the project
3. All development specific dependencies should be installed as a `dev-dependency` in the top level `package.json` via `yarn i --save-dev [package-name]`
4. All application specific dependencies should be installed in the specific packages `package.json` via `yarn i --save [package-name]`

### Running Environments Locally
The frontend application can be ran locally with different build configurations found in `config/env`.  The following commands are available:
 * `yarn start` Runs the application with the `development.js` configuration file
 * `yarn start:dev` Runs the application with the `development.js` configuration file
 * `yarn start:staging` Runs the application with the `staging.js` configuration file
 * `yarn start:testnet` Runs the application with the `testnet.js` configuration file
 * `yarn start:prod` Runs the application with the `production.js` configuration file
 * `yarn run:prod` Runs the application mimicking the production environment entirely (i.e. code is bundled and minified, HMR is disabled,
  Express server is used (`./server.js`) and the `production.js` configuration file is loaded)

Notes:
 * Developers will need to manually create the `development.js` and `staging.js` files
 * Custom application runtimes are possible by modifying the corresponding environment files found in the `config/env` folder
 
### Useful Chrome Extensions
 * [React Developer Tools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en) Inspect the React component tree
 * [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en) View/debug Redux state changes


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

### Bundle Reports
To visualize and interact with the treemap of the production code bundles files:
 * `yarn analyze`
Once completed, a browser will automatically open with the results.

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
