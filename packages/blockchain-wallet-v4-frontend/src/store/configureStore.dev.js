import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { persistStore, autoRehydrate } from 'redux-persist'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import { coreMiddleware } from 'blockchain-wallet-v4/src'
import { rootSaga, rootReducer, selectors } from 'data'
import settings from 'config'
import { api } from 'services/ApiService'
import { socket } from 'services/Socket'
import { serializer } from 'blockchain-wallet-v4/src/types'

const devToolsConfig = {
  maxAge: 1000,
  serialize: serializer,
  actionsBlacklist: [
    // '@@redux-form/INITIALIZE',
    // '@@redux-form/CHANGE',
    // '@@redux-form/REGISTER_FIELD',
    // '@@redux-form/UNREGISTER_FIELD',
    // '@@redux-form/UPDATE_SYNC_ERRORS',
    // '@@redux-form/FOCUS',
    // '@@redux-form/BLUR',
    // '@@redux-form/DESTROY',
    // '@@redux-form/RESET',
    // '@@redux-ui/MOUNT_UI_STATE',
    // '@@redux-ui/UNMOUNT_UI_STATE'
  ]
}

const configureStore = () => {
  const history = createBrowserHistory()
  const sagaMiddleware = createSagaMiddleware()
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(devToolsConfig) : compose
  const walletPath = settings.WALLET_PAYLOAD_PATH
  const kvStorePath = settings.WALLET_KVSTORE_PATH
  const isAuthenticated = selectors.auth.isAuthenticated

  const store = window.store = createStore(
    connectRouter(history)(rootReducer),
    composeEnhancers(
      applyMiddleware(
        routerMiddleware(history),
        coreMiddleware.kvStore({isAuthenticated, api, kvStorePath}),
        coreMiddleware.socket({ socket, walletPath, isAuthenticated }),
        coreMiddleware.walletSync({isAuthenticated, api, walletPath}),
        sagaMiddleware
      ),
      autoRehydrate()
    )
  )
  sagaMiddleware.run(rootSaga)
  persistStore(store, { whitelist: ['session', 'preferences'] })

  return {
    store,
    history
  }
}

export default configureStore
