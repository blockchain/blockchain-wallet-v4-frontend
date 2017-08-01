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
const { store, history } = configureStore()

// Register locales
const { messages } = configureLocales(store)

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
  module.hot.accept('./scenes/app.js', () => render(require('./scenes/app.js').default))
}
