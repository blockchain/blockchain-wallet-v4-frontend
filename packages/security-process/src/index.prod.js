import React from 'react'
import ReactDOM from 'react-dom'

import configureStore from 'store'
import App from 'scenes/app.js'
import Error from './index.error'

const renderApp = (
  Component,
  { imports, securityModule, store, history, persistor }
) => {
  ReactDOM.render(
    <Component
      imports={imports}
      securityModule={securityModule}
      store={store}
      history={history}
      persistor={persistor}
    />,
    document.getElementById('app')
  )
}

const renderError = () => {
  ReactDOM.render(<Error />, document.getElementById('app'))
}

configureStore()
  .then(root => {
    renderApp(App, root)
  })
  .catch(e => {
    // eslint-disable-next-line no-console
    console.info(e)
    renderError(e)
  })
