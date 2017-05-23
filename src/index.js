// Polyfill
import 'babel-polyfill'

// Internal resources
// import 'sass/blockchain-css.scss'

// Import React & JS
import React from 'react'
import { render } from 'react-dom'
import App from './containers/app.js'
// Import Redux
//
//

render(
  <App />,
  document.getElementById('app')
)
