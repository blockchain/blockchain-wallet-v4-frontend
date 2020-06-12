import { AppContainer } from 'react-hot-loader'
import React from 'react'
import ReactDOM from 'react-dom'

import App from './scenes/app'
import configureStore from './store'

import Error from './index.error'

const renderApp = (Component, store, history, persistor) => {
  const render = (Component, store, history, persistor) => {
    ReactDOM.render(
      <AppContainer key={Math.random()}>
        <Component store={store} history={history} persistor={persistor} />
      </AppContainer>,
      document.getElementById('app')
    )
  }

  render(App, store, history, persistor)

  // @ts-ignore
  if (module.hot) {
    // @ts-ignore
    module.hot.accept('./scenes/app.tsx', () =>
      render(require('./scenes/app.tsx').default, store, history, persistor)
    )
  }
}

const renderError = e => {
  // eslint-disable-next-line no-console
  console.error(e)
  ReactDOM.render(<Error />, document.getElementById('app'))
}

configureStore()
  .then(root => {
    renderApp(App, root.store, root.history, root.persistor)
  })
  .catch(e => {
    renderError(e)
  })
