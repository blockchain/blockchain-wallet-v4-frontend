import { createStore, applyMiddleware, compose } from 'redux'
import logger from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import persistState from 'redux-localstorage'
import { createBrowserHistory } from 'history'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import Immutable from 'immutable-ext'
import { walletSyncMiddleware, walletSocketMiddleware } from 'dream-wallet/lib/redux/middleware'
import autoDisconnectionMiddleware from '../middleware/autoDisconnectionMiddleware.js'
import rootSaga from '../data/rootSaga.js'
import rootReducer from '../data/rootReducer.js'
import settings from '../config'
import { api } from 'services/walletApi.js'

// import { Socket } from 'dream-wallet/lib/network'

const configureStore = () => {
  const history = createBrowserHistory()
  const sagaMiddleware = createSagaMiddleware()
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ serialize: { immutable: Immutable } }) : compose
  const wpath = settings.WALLET_IMMUTABLE_PATH

  const store = createStore(
    connectRouter(history)(rootReducer),
    composeEnhancers(
      persistState('session'),
      applyMiddleware(
        routerMiddleware(history),
        autoDisconnectionMiddleware,
        // walletSyncMiddleware({api, wpath}),
        // walletSocketMiddleware({ socket }),
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
