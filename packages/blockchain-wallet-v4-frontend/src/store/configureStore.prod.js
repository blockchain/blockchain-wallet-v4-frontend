import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { persistStore, autoRehydrate } from 'redux-persist'
import { createBrowserHistory } from 'history'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { coreMiddleware } from 'blockchain-wallet-v4/src'
import { rootSaga, rootReducer } from 'data'
import settings from 'config'
import { api } from 'services/ApiService'
import { socket } from 'services/Socket'
import { auth } from 'data/rootSelectors.js'
import { serializer } from 'blockchain-wallet-v4/src/types'

const devToolsConfig = {
  maxAge: 1000,
  serialize: serializer
}

const configureStore = () => {
  const history = createBrowserHistory()
  const sagaMiddleware = createSagaMiddleware()
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(devToolsConfig) : compose
  const walletPath = settings.WALLET_IMMUTABLE_PATH
  const reduxRouterMiddleware = routerMiddleware(history)

  const store = createStore(
    connectRouter(history)(rootReducer),
    composeEnhancers(
      applyMiddleware(
        reduxRouterMiddleware,
        // coreMiddleware.walletSync({isAuthenticated: auth.isAuthenticated, api, walletPath}),
        coreMiddleware.socket({ socket, walletPath, isAuthenticated: auth.isAuthenticated }),
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
