import { createStore, applyMiddleware, compose } from 'redux'
import logger from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import persistState from 'redux-localstorage'
import createHistory from 'history/createBrowserHistory'
import { routerMiddleware } from 'react-router-redux'
// import Immutable from 'immutable-ext'
// import { is } from 'ramda'
// import { coreMiddleware } from 'dream-wallet/lib'
import autoDisconnection from 'middleware/autoDisconnection.js'
import { rootSaga, rootReducer } from 'data'
// import settings from 'config'
// import { api } from 'services/walletApi.js'
// import { Socket } from 'dream-wallet/lib/network'
// import { auth } from 'data/rootSelectors.js'
import { serializer } from 'dream-wallet/lib/types'

const configureStore = () => {
  const history = createHistory()
  const sagaMiddleware = createSagaMiddleware()
  // const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ serialize: { immutable: Immutable } }) : compose
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(serializer) : compose
  // const walletPath = settings.WALLET_IMMUTABLE_PATH
  const reduxRouterMiddleware = routerMiddleware(history)

  const store = createStore(
    rootReducer,
    composeEnhancers(
      persistState(['session', 'preferences']),
      applyMiddleware(
        reduxRouterMiddleware,
        autoDisconnection,
        // coreMiddleware.walletSync({isAuthenticated: auth.isAuthenticated, api, walletPath}),
        // coreMiddleware.socket({ socket }),
        sagaMiddleware,
        logger
      )
    )
  )
  sagaMiddleware.run(rootSaga)

  return {
    store,
    history
    // runSaga: sagaMiddleware.run
  }
}

export default configureStore
