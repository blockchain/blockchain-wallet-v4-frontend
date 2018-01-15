import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from 'scenes/app.js'
import configureStore from 'store'
import configureLocales from 'services/LocalesService'
import {startSocket} from '../../blockchain-wallet-v4/src/ln/tcprelay/actions'
import {wrapHex} from '../../blockchain-wallet-v4/lib/ln/helper'
import {addPeer} from '../../blockchain-wallet-v4/src/ln/peers/actions'

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
store.dispatch(startSocket())

// TODO this is simulating the user opening a payment channel
setTimeout(() => {
  store.dispatch(startSocket())
  // store.dispatch(open(options))
}, 100)
