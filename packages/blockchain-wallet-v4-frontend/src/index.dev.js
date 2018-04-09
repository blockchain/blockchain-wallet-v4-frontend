import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from 'scenes/app.js'
import configureStore from 'store'
import configureLocales from 'services/LocalesService'

const storeConfig = configureStore()

storeConfig.then(x => {
  renderApp(App, x.store, x.history)
}).catch(e => {
  console.debug('Error', e)
  throw new Error('Could not fetch wallet-options.json')
})

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
    module.hot.accept('scenes/app.js', () => render(require('scenes/app.js').default))
  }
}
