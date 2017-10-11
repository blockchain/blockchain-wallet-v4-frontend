import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { persistStore, autoRehydrate } from 'redux-persist'
import { createBrowserHistory } from 'history'
import { routerMiddleware } from 'react-router-redux'
import { coreMiddleware } from 'blockchain-wallet-v4/src'
import { rootSaga, rootReducer, selectors } from 'data'
import settings from 'config'
import { api } from 'services/ApiService'
import { socket } from 'services/Socket'
import { serializer } from 'blockchain-wallet-v4/src/types'

const devToolsConfig = {
  maxAge: 1000,
  serialize: serializer
}

const configureStore = () => {
  const history = createBrowserHistory()
  const sagaMiddleware = createSagaMiddleware()
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(devToolsConfig) : compose
  const walletPath = settings.WALLET_PAYLOAD_PATH
  const reduxRouterMiddleware = routerMiddleware(history)

  const store = createStore(
    rootReducer,
    composeEnhancers(
      applyMiddleware(
        reduxRouterMiddleware,
        // coreMiddleware.walletSync({isAuthenticated: auth.isAuthenticated, api, walletPath}),
        coreMiddleware.socket({ socket, walletPath, isAuthenticated: selectors.auth.isAuthenticated }),
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
