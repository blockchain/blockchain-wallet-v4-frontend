# iOS Wallet Application

## Setup

Run `npm install`

This will install the required dependencies.

Run `sh installcore.sh`

This will install blockchain-wallet-v4.

Run `sh hackmodules.sh`

This will nodeify modules, letting us import `crypto`.

Run `sh patchfetch.sh`

This will make it so that `fetch` doesn't crash the build.

Install the standalone [React Native debugger](https://github.com/jhen0409/react-native-debugger) via homebrew:
```
$ brew update && brew cask install react-native-debugger
```

Run `npm start`
This will start the bundler and open the simulator.
