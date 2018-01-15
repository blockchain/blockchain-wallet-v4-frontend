import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from 'scenes/app.js'
import configureStore from 'store'
import configureLocales from 'services/LocalesService'
import {startSocket} from '../../blockchain-wallet-v4/src/ln/tcprelay/actions'
import {wrapHex} from '../../blockchain-wallet-v4/lib/ln/helper'
import {addPeer} from '../../blockchain-wallet-v4/src/ln/peers/actions'
import {open} from '../../blockchain-wallet-v4/src/ln/channel/actions'
import Long from 'long'

const { store, history } = configureStore()

const { messages } = configureLocales(store)

const render = Component => {
  ReactDOM.render(
    <AppContainer key={Math.random()} warnings={false}>
      <Component store={store} history={history} messages={messages} />
    </AppContainer>,
    document.getElementById('app')
  )
}

render(App)

if (module.hot) {
  module.hot.accept('scenes/app.js', () => render(require('scenes/app.js').default))
}


store.dispatch(addPeer(wrapHex('02c39955c1579afe4824dc0ef4493fdf7f3660b158cf6d367d8570b9f19683afb5')))

// TODO move to bootstrap section
//store.dispatch(startSocket())

let options = {
  chainHash: Buffer.from('06226e46111a0b59caaf126043eb5bbf28c34f3a5e332a1fc7b2b73cf188910f', 'hex'),
  dustLimitSatoshis: Long.fromNumber(546),
  maxHtlcValueInFlightMsat: Long.fromNumber(100000),
  channelReserveSatoshis: Long.fromNumber(1000),
  feeRatePerKw: 10000,
  htlcMinimumMsat: 1,
  toSelfDelay: 60,
  maxAcceptedHtlcs: 100,
  staticRemote: wrapHex('02c39955c1579afe4824dc0ef4493fdf7f3660b158cf6d367d8570b9f19683afb5'),
  value: Long.fromNumber(1)
}

// TODO this is simulating the user opening a payment channel
setTimeout(() => {
  store.dispatch(startSocket())
  // store.dispatch(open(options))
  setTimeout(() => {
    console.log('create payment channel')
    store.dispatch(open(options))
  }, 3000)

}, 100)
