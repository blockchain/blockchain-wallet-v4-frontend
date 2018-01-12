import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from 'scenes/app.js'
import configureStore from 'store'
import configureLocales from 'services/LocalesService'
import {startSocket} from '../../blockchain-wallet-v4/src/ln/tcprelay/actions'
import {open} from '../../blockchain-wallet-v4/src/ln/channel/actions'

const { store, history } = configureStore()

const { messages } = configureLocales(store)

const Long = require('long')

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



let options = {
  chainHash: Buffer.from('06226e46111a0b59caaf126043eb5bbf28c34f3a5e332a1fc7b2b73cf188910f', 'hex'),
  dustLimitSatoshis: Long.fromNumber(546),
  maxHtlcValueInFlightMsat: Long.fromNumber(100000),
  channelReserveSatoshis: Long.fromNumber(1000),
  feeRatePerKw: 10000,
  htlcMinimumMsat: 1,
  toSelfDelay: 60,
  maxAcceptedHtlcs: 100,

  staticRemote: Buffer.from('02064792bfd15aa44906c8d20da44adc095c57cd0aeb3a8c4a29662fb814eb8d08'),
  value: Long.fromNumber(100000)
}



store.dispatch(startSocket())






setTimeout(() => {
  store.dispatch(open(options))
}, 100)
