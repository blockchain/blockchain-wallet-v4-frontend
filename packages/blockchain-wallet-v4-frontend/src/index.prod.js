import React from 'react'
import ReactDOM from 'react-dom'

import './favicons'
import App from 'scenes/app.js'
import configureStore from 'store'
import Error from './index.error'

const renderApp = (Component, store, history, persistor) => {
  ReactDOM.render(
    <Component store={store} history={history} persistor={persistor} />,
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
