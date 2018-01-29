import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from 'scenes/app.js'
import configureStore from 'store'
import configureLocales from 'services/LocalesService'
import {startSocket} from '../../blockchain-wallet-v4/src/ln/tcprelay/actions'
import {wrapHex} from '../../blockchain-wallet-v4/lib/ln/helper'
import {addPeer, disconnect, connect} from '../../blockchain-wallet-v4/src/ln/peers/actions'
import {startUp} from '../../blockchain-wallet-v4/src/ln/root/actions'
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

store.dispatch(startUp())

const peer = '02c39955c1579afe4824dc0ef4493fdf7f3660b158cf6d367d8570b9f19683afb5'
setTimeout(() => {
  store.dispatch(addPeer(wrapHex(peer)))

// TODO move to bootstrap section
  store.dispatch(startSocket())
  store.dispatch({type: 'LOGIN', payload: {guid: '2d2e974b-c148-404a-a704-99e51f0bf36d', password: '1234567890a'}})
}, 500)

// TODO this is simulating the user opening a payment channel
setTimeout(() => {
  store.dispatch(open(peer, Long.fromNumber(100000)))
}, 2500)
