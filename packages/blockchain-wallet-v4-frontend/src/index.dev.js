import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from 'scenes/app.js'
import configureStore from 'store'
import configureLocales from 'services/LocalesService'

const render = Component => {
  fetch('/Resources/wallet-options.json')
    .then((res) => res.json())
    .then((opts) => {
      const { store, history } = configureStore(opts)
      const { messages } = configureLocales(store)

      ReactDOM.render(
        <AppContainer key={Math.random()} warnings={false}>
          <Component store={store} history={history} messages={messages} />
        </AppContainer>,
        document.getElementById('app')
      )
    })
}

render(App)

if (module.hot) {
  module.hot.accept('scenes/app.js', () => render(require('scenes/app.js').default))
}
