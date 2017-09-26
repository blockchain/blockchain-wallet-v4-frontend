// Internal resources
import './assets/sass/global.scss'

// Import React & JS
import React from 'react'
import ReactDOM from 'react-dom'
import App from 'scenes/app.js'
import configureStore from 'store'
import configureLocales from 'services/LocalesService'

const { store, history } = configureStore()

const { messages } = configureLocales(store)

ReactDOM.render(
  <App store={store} history={history} messages={messages} />,
  document.getElementById('app')
)
