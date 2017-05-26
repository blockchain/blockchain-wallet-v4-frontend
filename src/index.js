// Polyfill
import 'babel-polyfill'

// Internal resources
import './index.scss'

// Import React & JS
import React from 'react'
import ReactDOM from 'react-dom'
import App from './containers/app.js'
import configureStore from './store/configureStore.dev'

const store = configureStore()

ReactDOM.render(
  <App store={store} />,
  document.getElementById('app')
)
