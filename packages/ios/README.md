# iOS Wallet Application

## 🔨 Setup

Download and install the newest version of Xcode from the Mac App Store.

Make sure you have the latest version of the [core](https://github.com/blockchain/blockchain-wallet-v4-frontend/blob/master/README.md) installed. Then navigate into `blockchain-wallet-v4-frontend/packages/ios` and execute the following steps:

Run `npm install` to install the required dependencies.

Run `sh installcore.sh` to install blockchain-wallet-v4.

Run `sh hackmodules.sh` to nodeify modules, letting us import `crypto`.

Run `sh patchfetch.sh` to make it so that `fetch` doesn't crash the build.

Install the standalone [React Native debugger](https://github.com/jhen0409/react-native-debugger) via homebrew:
```
$ brew update && brew cask install react-native-debugger
```

Finally, you must create the required environment files in (`blockchain-wallet-v4-frontend/packages/ios`). These must match the following naming convention: `.env.staging`, `.env.production`.

Contact the appropriate developer for obtaining your credentials.

## 🏃‍♂️ Running
`npm start` will start the bundler and open the simulator. It takes a few seconds to serve the JS from the bundler, so be patient. Once loaded, press `⌘ + D` to reveal the developer menu and select `Start Remote JS Debugging`. This will allow the React Native debugger to connect to the application.

## ℹ️ Helpful Tips
It is recommended to have the React Native debugger open before running `npm start`. You should also enable hot reloading to automatically reload the application whenever a JS file changes.

⚠️ If all else fails: `rm -rf node_modules` and start over.
