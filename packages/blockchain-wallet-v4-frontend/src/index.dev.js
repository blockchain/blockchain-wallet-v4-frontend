import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from 'scenes/app.js'
import configureStore from 'store'
import configureLocales from 'services/LocalesService'
import walletOptions from '../../../config/wallet-options.json'

const { store, history } = configureStore(walletOptions)
const { messages } = configureLocales(store)

const render = Component => {
  // simulate wallet-options call but use walletOptions
  fetch('/Resources/wallet-options.json')
    .then((res) => res.json())
    .then((opts) => {
      ReactDOM.render(
        <AppContainer key={Math.random()} warnings={false}>
          <Component store={store} history={history} messages={messages} />
        </AppContainer>,
        document.getElementById('app')
      )
    })
}

render(App)

if (module.hot) {
  module.hot.accept('scenes/app.js', () => render(require('scenes/app.js').default))
}
