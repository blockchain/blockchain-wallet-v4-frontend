import React from 'react'
import ReactDOM from 'react-dom'

import { IconGlobalStyles, FontGlobalStyles } from 'blockchain-info-components'
import './favicons'
import configureStore from 'store'
import configureLocales from 'services/LocalesService'
import App from 'scenes/app.js'
import Error from './index.error'

const renderApp = (Component, store, history) => {
  const { messages } = configureLocales(store)
  ReactDOM.render(
    <Component store={store} history={history} messages={messages}>
      <IconGlobalStyles />
      <FontGlobalStyles />
    </Component>,
    document.getElementById('app')
  )
}

const renderError = () => {
  ReactDOM.render(
    <React.Fragment>
      <Error />
      <IconGlobalStyles />
      <FontGlobalStyles />
    </React.Fragment>,
    document.getElementById('app')
  )
}

// =============================================================================
// ================================= APP =======================================
// =============================================================================
configureStore()
  .then(x => {
    renderApp(App, x.store, x.history)
  })
  .catch(e => {
    renderError(e)
  })
