import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { persistStore, persistCombineReducers } from 'redux-persist'
import getStoredStateMigrateV4 from 'redux-persist/lib/integration/getStoredStateMigrateV4'
import { createHashHistory } from 'history'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { head } from 'ramda'
import Bitcoin from 'bitcoinjs-lib'
import BitcoinCash from 'bitcoinforksjs-lib'

import { coreMiddleware } from 'blockchain-wallet-v4/src'
import {
  createWalletApi,
  Socket,
  ApiSocket
} from 'blockchain-wallet-v4/src/network'

import httpService from 'blockchain-wallet-v4/src/network/api/http'
import Settings from 'blockchain-wallet-v4/src/network/api/settings'
import SecurityModule from 'blockchain-wallet-v4/src/SecurityModule'
import { serializer } from 'blockchain-wallet-v4/src/types'
import { actions, rootSaga, rootReducer, selectors } from 'data'
import IPC from '../IPC'

const devToolsConfig = {
  maxAge: 1000,
  name: `Security Process`,
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
    // '@@redux-form/RESET'
  ]
}

export default IPC(async ({ imports, middleware: IPCmiddleware }) => {
  const { options, localStorage } = imports
  const history = createHashHistory()
  const sagaMiddleware = createSagaMiddleware()
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(devToolsConfig)
    : compose
  const walletPath = 'wallet.payload'
  const kvStorePath = 'wallet.kvstore'
  const isAuthenticated = selectors.auth.isAuthenticated
  const apiKey = '1770d5d9-bcea-4d28-ad21-6cbd5be018a8'
  // TODO: deprecate when wallet-options-v4 is updated on prod
  const socketUrl = head(options.domains.webSocket.split('/inv'))
  const btcSocket = new Socket({
    options,
    url: `${socketUrl}/inv`
  })
  const bchSocket = new Socket({
    options,
    url: `${socketUrl}/bch/inv`
  })
  const ethSocket = new Socket({
    options,
    url: `${socketUrl}/eth/inv`
  })
  const ratesSocket = new ApiSocket({
    options,
    url: `${socketUrl}/nabu-gateway/markets/quotes`,
    maxReconnects: 3
  })

  const getAuthCredentials = () =>
    selectors.modules.profile.getAuthCredentials(store.getState())
  const reauthenticate = () => store.dispatch(actions.modules.profile.signIn())
  const networks = {
    btc: Bitcoin.networks[options.platforms.web.coins.BTC.config.network],
    bch: BitcoinCash.networks[options.platforms.web.coins.BTC.config.network],
    eth: options.platforms.web.coins.ETH.config.network,
    xlm: options.platforms.web.coins.XLM.config.network
  }

  const http = httpService({ apiKey, imports })

  const baseApi = createWalletApi({
    http,
    options,
    getAuthCredentials,
    reauthenticate,
    networks
  })
  const persistWhitelist = ['session', 'preferences', 'cache']

  // TODO: remove getStoredStateMigrateV4 someday (at least a year from now)
  const store = createStore(
    connectRouter(history)(
      persistCombineReducers(
        {
          getStoredState: getStoredStateMigrateV4({
            storage: localStorage,
            whitelist: persistWhitelist
          }),
          key: 'root',
          storage: localStorage,
          whitelist: persistWhitelist
        },
        rootReducer
      )
    ),
    composeEnhancers(
      applyMiddleware(
        IPCmiddleware,
        sagaMiddleware,
        routerMiddleware(history),
        coreMiddleware.kvStore({ isAuthenticated, api: baseApi, kvStorePath }),
        coreMiddleware.walletSync({ isAuthenticated, api: baseApi, walletPath })
      )
    )
  )

  const rootUrl = options.domains.root
  const securityModule = SecurityModule({ http, rootUrl, store })
  const api = { ...baseApi, ...Settings({ ...http, rootUrl, securityModule }) }
  const persistor = persistStore(store, null)

  sagaMiddleware.run(rootSaga, {
    api,
    bchSocket,
    btcSocket,
    ethSocket,
    imports,
    ratesSocket,
    networks,
    options,
    securityModule
  })

  // expose globals here
  window.createTestXlmAccounts = () => {
    store.dispatch(actions.core.data.xlm.createTestAccounts())
  }

  return {
    api,
    imports,
    securityModule,
    store,
    history,
    persistor
  }
})
