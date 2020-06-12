import { BrowserRouter } from 'react-router-dom'
import React from 'react'
import ReactDOM from 'react-dom'

import App from './scenes/app'
import configureStore from './store'

import Error from './index.error'

const renderApp = (Component, store, history, persistor) => {
  ReactDOM.render(
    <BrowserRouter>
      <Component store={store} history={history} persistor={persistor} />
    </BrowserRouter>,
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
    renderError()
  })
