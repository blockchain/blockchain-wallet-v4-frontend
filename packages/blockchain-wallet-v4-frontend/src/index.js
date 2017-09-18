// Internal resources
import './assets/sass/global.scss'

// Import React & JS
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from 'scenes/app.js'
import configureStore from 'store'
import configureLocales from 'services/LocalesService'
import Peer from 'blockchain-wallet-v4/src/ln/peer'
import Parser from 'blockchain-wallet-v4/src/ln/parser'

var ec = require('bcoin/lib/crypto/secp256k1-browser')

console.info('test')

let staticLocal = {}
staticLocal.priv = Buffer.from('022a72195e7eaf2f032fef55114ba026f573e34f7606edb3089d5189a0b2a367', 'hex')
staticLocal.pub = ec.publicKeyCreate(staticLocal.priv, true)

console.info('Starting! \nNode ID: ' + staticLocal.pub.toString('hex'))

let staticRemote = {}
staticRemote.pub = Buffer.from('022a72195e7eaf2f032fef55114ba026f573e34f7606edb3089d5189a0b2a368cd', 'hex')

Parser({network: 'testnet'})
console.info('Parser setup with testnet')
let p = new Peer(staticLocal, staticRemote)
p.connect()

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
