// Polyfill
import 'babel-polyfill'

// Internal resources
import './assets/sass/global.scss'

// Import React & JS
import React from 'react'
import ReactDOM from 'react-dom'
import App from './scenes/app.js'
import configureLocales from './store/configureLocales'
import configureStore from './store/configureStore.dev'

// Register store
const { store, history } = configureStore()

// Register locales
const { messages } = configureLocales(store)

ReactDOM.render(
  <App store={store} history={history} messages={messages} />,
  document.getElementById('app')
)
