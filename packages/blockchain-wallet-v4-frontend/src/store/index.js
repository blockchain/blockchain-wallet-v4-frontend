import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { persistStore, autoRehydrate } from 'redux-persist'
import { createBrowserHistory } from 'history'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import appConfig from 'config'
import { coreMiddleware } from 'blockchain-wallet-v4/src'
import { createWalletApi, Socket } from 'blockchain-wallet-v4/src/network'
import { serializer } from 'blockchain-wallet-v4/src/types'
import { rootSaga, rootReducer, selectors } from 'data'
import { autoDisconnection, webSocketBch, webSocketBtc, webSocketEth } from '../middleware'

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
  // TODO: should these tools be allowed in upper environments!?
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(devToolsConfig) : compose
  const walletPath = appConfig.WALLET_PAYLOAD_PATH
  const kvStorePath = appConfig.WALLET_KVSTORE_PATH
  const isAuthenticated = selectors.auth.isAuthenticated

  return fetch('/Resources/wallet-options-v4.json')
    .then(res => res.json())
    .then(options => {
      const apiKey = '1770d5d9-bcea-4d28-ad21-6cbd5be018a8'
      const bchSocket = new Socket({ options, socketType: '/bch' })
      const btcSocket = new Socket({ options, socketType: '' })
      const ethSocket = new Socket({ options, socketType: '/eth' })
      const api = createWalletApi({ options, apiKey })

      const store = createStore(
        connectRouter(history)(rootReducer),
        composeEnhancers(
          applyMiddleware(
            sagaMiddleware,
            routerMiddleware(history),
            coreMiddleware.kvStore({ isAuthenticated, api, kvStorePath }),
            webSocketBch(bchSocket),
            webSocketEth(ethSocket),
            webSocketBtc(btcSocket),
            coreMiddleware.walletSync({ isAuthenticated, api, walletPath }),
            autoDisconnection()
          ),
          autoRehydrate()
        )
      )
      persistStore(store, { whitelist: ['session', 'preferences', 'cache'] })
      sagaMiddleware.run(rootSaga, { api, bchSocket, btcSocket, ethSocket, options })

      return {
        store,
        history
      }
    })
}

export default configureStore
