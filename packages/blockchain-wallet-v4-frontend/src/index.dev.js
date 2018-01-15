import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from 'scenes/app.js'
import configureStore from 'store'
import configureLocales from 'services/LocalesService'
import {startSocket} from '../../blockchain-wallet-v4/src/ln/tcprelay/actions'
import {open} from '../../blockchain-wallet-v4/src/ln/channel/actions'
<<<<<<< HEAD
import {addPeer} from '../../blockchain-wallet-v4/src/ln/peers/actions'
=======
import {wrapPubKey} from "../../blockchain-wallet-v4/src/ln/channel";
import {wrapHex} from "../../blockchain-wallet-v4/lib/ln/helper";
>>>>>>> 19cab43b0d4272b371a38c123f0e74efcf61e8dd

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



store.dispatch(addPeer(Buffer.from('02c39955c1579afe4824dc0ef4493fdf7f3660b158cf6d367d8570b9f19683afb5', 'hex')))
let options = {
  chainHash: Buffer.from('06226e46111a0b59caaf126043eb5bbf28c34f3a5e332a1fc7b2b73cf188910f', 'hex'),
  dustLimitSatoshis: Long.fromNumber(546),
  maxHtlcValueInFlightMsat: Long.fromNumber(100000),
  channelReserveSatoshis: Long.fromNumber(1000),
  feeRatePerKw: 10000,
  htlcMinimumMsat: 1,
  toSelfDelay: 60,
  maxAcceptedHtlcs: 100,

  staticRemote: wrapPubKey(wrapHex('02064792bfd15aa44906c8d20da44adc095c57cd0aeb3a8c4a29662fb814eb8d08')),
  value: Long.fromNumber(100000)
}


setTimeout(() => {
  store.dispatch(startSocket())
  //store.dispatch(open(options))
}, 100)
