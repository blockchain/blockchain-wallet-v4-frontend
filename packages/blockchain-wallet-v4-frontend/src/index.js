// Internal resources
import './assets/sass/global.scss'

// Import React & JS
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from 'scenes/app.js'
import configureStore from 'store'
import configureLocales from 'services/LocalesService'
import * as LN from 'blockchain-wallet-v4/src/ln/index'
import * as random from 'crypto'


var ec = require('../../bcoin/lib/crypto/secp256k1-browser')

console.info('test')

let options = {}

let staticLocal = {}
staticLocal.priv = random.randomBytes(32)
staticLocal.pub = ec.publicKeyCreate(staticLocal.priv, true)

options.staticLocal = staticLocal
options.network = 'testnet'

console.info('Starting! \nNode ID: ' + staticLocal.pub.toString('hex'))

LN.startUp(options)

// Register store
const { store, history } = configureStore()

// Register locales
const { messages } = configureLocales(store)

// Documentation: https://github.com/gaearon/react-hot-loader/tree/master/docs
const render = Component => {
  ReactDOM.render(
    <AppContainer key={Math.random()}>
      <Component store={store} history={history} messages={messages} />
    </AppContainer>,
    document.getElementById('app')
  )
}

render(App)

if (module.hot) {
  module.hot.accept('scenes/app.js', () => render(require('scenes/app.js').default))
}
