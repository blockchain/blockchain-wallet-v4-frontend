import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { persistStore, autoRehydrate } from 'redux-persist'
import { createBrowserHistory } from 'history'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { path } from 'ramda'
import { coreMiddleware } from 'blockchain-wallet-v4/src'
import { createWalletApi, Socket } from 'blockchain-wallet-v4/src/network'
import { rootSaga, rootReducer, selectors } from 'data'
import settings from 'config'
import { serializer } from 'blockchain-wallet-v4/src/types'
import { autoDisconnection } from '../middleware'

const devToolsConfig = {
  maxAge: 1000,
  serialize: serializer
}

const configureStore = () => {
  const history = createBrowserHistory()
  const sagaMiddleware = createSagaMiddleware()
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(devToolsConfig) : compose
  const walletPath = settings.WALLET_PAYLOAD_PATH
  const kvStorePath = settings.WALLET_KVSTORE_PATH
  const isAuthenticated = selectors.auth.isAuthenticated

  return fetch('/Resources/wallet-options.json')
    .then(res => JSON.parse(res))
    .then(options => {
      const rootUrl = path(['domains', 'root'], options)
      const apiUrl = path(['domains', 'api', options])
      const apiKey = '1770d5d9-bcea-4d28-ad21-6cbd5be018a8'
      const api = createWalletApi(rootUrl, apiUrl, apiKey)
      const socket = new Socket({ wsUrl })

      const store = createStore(
        connectRouter(history)(rootReducer),
        composeEnhancers(
          applyMiddleware(
            routerMiddleware(history),
            coreMiddleware.kvStore({ isAuthenticated, api, kvStorePath }),
            coreMiddleware.socket.bitcoin({ socket, walletPath, isAuthenticated }),
            coreMiddleware.walletSync({ isAuthenticated, api, walletPath }),
            autoDisconnection(),
            sagaMiddleware
          ),
          autoRehydrate()
        )
      )
      persistStore(store, { whitelist: ['session', 'preferences'] })
      sagaMiddleware.run(rootSaga, api, options)

      return {
        store,
        history
      }
    })
}

export default configureStore
