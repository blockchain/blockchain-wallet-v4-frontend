// Internal resources
import './assets/sass/global.scss'

// Import React & JS
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from 'scenes/app.js'
import { defaultTheme } from 'themes'
import configureStore from 'store'
import configureLocales from 'services/LocalesService'

// Register store
let configureStorePayload = configureStore()
if (module.hot) { module.hot.accept('store', () => { configureStorePayload = require('store').default() }) }
const { store, history } = configureStorePayload

// Register locales
let configureLocalesPayload = configureLocales(store)
if (module.hot) { module.hot.accept('services/LocalesService', () => { configureLocalesPayload = require('services/LocalesService').default(store) }) }
const { messages } = configureLocalesPayload

// Documentation: https://github.com/gaearon/react-hot-loader/tree/master/docs
const render = Component => {
  ReactDOM.render(
    <AppContainer key={Math.random()}>
      <Component store={store} history={history} messages={messages} theme={defaultTheme} />
    </AppContainer>,
    document.getElementById('app')
  )
}

render(App)

if (module.hot) {
  module.hot.accept('scenes/app.js', () => render(require('scenes/app.js').default))
}
