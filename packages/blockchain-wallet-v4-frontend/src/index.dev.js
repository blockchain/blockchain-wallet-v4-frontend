import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import './favicons'
import configureStore from 'store'
import configureLocales from 'services/LocalesService'
import App from 'scenes/app.js'
import Error from './index.error'

const renderApp = (Component, store, history) => {
  const { messages } = configureLocales(store)

  const render = (Component, store, history, messages) => {
    ReactDOM.render(
      <AppContainer key={Math.random()} warnings={false}>
        <Component store={store} history={history} messages={messages} />
      </AppContainer>,
      document.getElementById('app')
    )
  }

  render(App, store, history, messages)

  if (module.hot) {
    module.hot.accept('./scenes/app.js', () => render(require('./scenes/app.js').default, store, history, messages))
  }
}

const renderError = (e) => {
  ReactDOM.render(
    <Error />,
    document.getElementById('app')
  )
}

// =============================================================================
// ================================= APP =======================================
// =============================================================================
configureStore().then(x => {
  renderApp(App, x.store, x.history)
}).catch(e => {
  renderError(e)
})
