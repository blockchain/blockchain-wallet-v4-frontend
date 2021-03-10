import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from 'scenes/app.tsx'
import configureStore from 'store'

import { FontGlobalStyles, IconGlobalStyles } from 'blockchain-info-components'

import Error from './index.error'

const renderApp = (Component, store, history, persistor) => {
  ReactDOM.render(
    <>
      <BrowserRouter>
        <Component store={store} history={history} persistor={persistor} />
      </BrowserRouter>
      <FontGlobalStyles />
      <IconGlobalStyles />
    </>,
    document.getElementById('app')
  )
}

const renderError = () => {
  ReactDOM.render(<Error />, document.getElementById('app'))
}

configureStore()
  .then(root => {
    renderApp(App, root.store, root.history, root.persistor)
  })
  .catch(e => {
    // eslint-disable-next-line no-console
    console.info(e)
    renderError(e)
  })
