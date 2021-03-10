import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { BrowserRouter } from 'react-router-dom'
import App from 'scenes/app.tsx'
import configureStore from 'store'

import { FontGlobalStyles, IconGlobalStyles } from 'blockchain-info-components'

import Error from './index.error'

const renderApp = (Component, store, history, persistor) => {
  const render = (Component, store, history, persistor) => {
    ReactDOM.render(
      <>
        <BrowserRouter>
          <AppContainer key={Math.random()} warnings={false}>
            <Component store={store} history={history} persistor={persistor} />
          </AppContainer>
        </BrowserRouter>
        <FontGlobalStyles />
        <IconGlobalStyles />
      </>,
      document.getElementById('app')
    )
  }

  render(App, store, history, persistor)

  if (module.hot) {
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
