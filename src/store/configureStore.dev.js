import { createStore, applyMiddleware, compose } from 'redux'
import logger from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import { rootSaga } from '../sagas'
import reducers from '../reducers'
import * as C from '../config'
import Immutable from 'immutable-ext'
import { createWalletApi } from 'dream-wallet/lib/network'
import { walletSyncMiddleware, walletSocketMiddleware } from 'dream-wallet/lib/middleware'
import persistState from 'redux-localstorage'
// import { Socket } from 'dream-wallet/lib/network'

const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware()
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(
    { serialize: { immutable: Immutable } }) || compose
  const api = createWalletApi(
    { rootUrl: C.ROOT_URL,
      apiUrl: C.API_BLOCKCHAIN_INFO,
      apiCode: C.API_CODE})

  const store = createStore(
    reducers({wpath: C.WALLET_IMMUTABLE_PATH, dpath: C.BLOCKCHAIN_DATA_PATH}),
    composeEnhancers(
      persistState('session'),
      applyMiddleware(
        walletSyncMiddleware({api: api, wpath: C.WALLET_IMMUTABLE_PATH}),
        // walletSocketMiddleware({ socket }),
        sagaMiddleware,
        logger
      )
    )
  )
  sagaMiddleware.run(rootSaga(
    { api: api,
      wpath: C.WALLET_IMMUTABLE_PATH,
      dpath: C.BLOCKCHAIN_DATA_PATH}))

  return {
    ...store
    // runSaga: sagaMiddleware.run
  }
}

export default configureStore
