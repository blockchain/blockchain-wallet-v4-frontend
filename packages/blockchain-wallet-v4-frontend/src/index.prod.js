import React from 'react'
import ReactDOM from 'react-dom'
import App from 'scenes/app.js'
import configureStore from 'store'
import configureLocales from 'services/LocalesService'

fetch('/Resources/wallet-options.json')
  .then((res) => res.json())
  .then((opts) => {
    const { store, history } = configureStore(opts)
    const { messages } = configureLocales(store)

    ReactDOM.render(
      <App store={store} history={history} messages={messages} />,
      document.getElementById('app')
    )
  })
