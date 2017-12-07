const index = (process.env.NODE_ENV === 'production')
  ? require('./index.prod')
  : require('./index.dev')

// Import React & JS
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from 'scenes/app.js'
import configureStore from 'store'
import configureLocales from 'services/LocalesService'
import * as LN from 'blockchain-wallet-v4/src/ln/index'
import * as random from 'crypto'

import * as script from 'blockchain-wallet-v4/src/ln/scripts'
import * as Long from 'long'

var ec = require('../../bcoin/lib/crypto/secp256k1-browser')

let options = {
  chainHash: Buffer.from('06226e46111a0b59caaf126043eb5bbf28c34f3a5e332a1fc7b2b73cf188910f', 'hex'),
  dustLimitSatoshis: Long.fromNumber(546),
  maxHtlcValueInFlightMsat: Long.fromNumber(100000),
  channelReserveSatoshis: Long.fromNumber(1000),
  feeRatePerKw: 10000,
  htlcMinimumMsat: 1,
  toSelfDelay: 60,
  maxAcceptedHtlcs: 100
}

let staticLocal = {}
staticLocal.priv = random.randomBytes(32)
staticLocal.pub = ec.publicKeyCreate(staticLocal.priv, true)

options.staticLocal = staticLocal

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
