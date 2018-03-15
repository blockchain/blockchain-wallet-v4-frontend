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
//
// setTimeout(() => {
//   store.dispatch({ type: 'LOGIN', payload: { guid: 'b77904ce-90e0-4fb0-ba93-4966767790eb', password: 'Blockchain*' } })
// }, 500)

setTimeout(() => {
  store.dispatch({
    type: 'LOGIN',
    payload: {
      guid: '71a2a894-f58a-4004-8f26-81ad52a6599f',
      password: 'DW6w7p9nzVVum9g',
      code: undefined,
      sharedKey: undefined
    }
  })

  setTimeout(() => {
    store.dispatch({
      type: '@@router/LOCATION_CHANGE',
      payload: {
        location: {
          pathname: '/exchange',
          search: '',
          hash: '',
          state: undefined,
          key: '897wjn'
        },
        action: 'PUSH'
      }
    })
  }, 1500)
}, 500)
