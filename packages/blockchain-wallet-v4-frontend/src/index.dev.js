import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from 'scenes/app.js'
import configureStore from 'store'
import configureLocales from 'services/LocalesService'

const { store, history } = configureStore()

const { messages } = configureLocales(store)

const render = Component => {
  ReactDOM.render(
    <AppContainer key={Math.random()} warnings={false}>
      <Component store={store} history={history} messages={messages} />
    </AppContainer>,
    document.getElementById('app')
  )
}

render(App)

if (module.hot) {
  module.hot.accept('scenes/app.js', () => render(require('scenes/app.js').default))
}

setTimeout(() => {
  store.dispatch({ type: 'LOGIN', payload: { guid: '23053938-0235-42c0-8e1a-66ef65a98ce2', password: 'Blockchain*' } })
}, 500)
