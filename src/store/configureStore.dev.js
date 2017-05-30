import { createStore, applyMiddleware, compose } from 'redux'
import logger from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import rootSaga from '../data/rootSaga.js'
import rootReducer from '../data/rootReducer.js'
import settings from '../config'
import { api } from 'services/walletApi.js'
import Immutable from 'immutable-ext'
import { walletSyncMiddleware, walletSocketMiddleware } from 'dream-wallet/lib/middleware'
import persistState from 'redux-localstorage'
// import { Socket } from 'dream-wallet/lib/network'

const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware()
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ serialize: { immutable: Immutable } }) : compose

  const wpath = settings.WALLET_IMMUTABLE_PATH

  const store = createStore(
    rootReducer,
    composeEnhancers(
      persistState('session'),
      applyMiddleware(
        walletSyncMiddleware({api, wpath}),
        // walletSocketMiddleware({ socket }),
        sagaMiddleware,
        logger
      )
    )
  )
  sagaMiddleware.run(rootSaga)

  return {
    ...store
    // runSaga: sagaMiddleware.run
  }
}

export default configureStore
