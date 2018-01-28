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
  store.dispatch({type: 'LOGIN', payload: {guid: 'f1858584-4eae-4738-95a6-9c31e22f78f3', password: 'password123'}})
}, 500)
