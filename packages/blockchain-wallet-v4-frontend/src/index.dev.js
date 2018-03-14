import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from 'scenes/app.js'
import configureStore from 'store'
import configureLocales from 'services/LocalesService'
import {open} from '../../blockchain-wallet-v4/src/ln/channel/actions'
import * as LN_API from '../../blockchain-wallet-v4/src/ln/api/actions'

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

store.dispatch(LN_API.startup.EVENT())

const peer = '0362a72a9a5de53c5e926a0d7fbad8ce6adb2cdabcdb0ce8cbe35549d106b38582'
setTimeout(() => {
// TODO move to bootstrap section
  store.dispatch({type: 'LOGIN', payload: {guid: '2d2e974b-c148-404a-a704-99e51f0bf36d', password: '1234567890a'}})
}, 500)

// TODO this is simulating the user opening a payment channel
setTimeout(() => {
  store.dispatch(LN_API.openChannel.EVENT(peer, 100000))
}, 4000)
