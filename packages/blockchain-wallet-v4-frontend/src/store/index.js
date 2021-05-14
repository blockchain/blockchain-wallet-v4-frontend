import BitcoinCash from 'bitcoinforksjs-lib'
import * as Bitcoin from 'bitcoinjs-lib'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { createHashHistory } from 'history'
import { applyMiddleware, compose, createStore } from 'redux'
import { persistCombineReducers, persistStore } from 'redux-persist'
import getStoredStateMigrateV4 from 'redux-persist/lib/integration/getStoredStateMigrateV4'
import storage from 'redux-persist/lib/storage'
import createSagaMiddleware from 'redux-saga'

import { coreMiddleware } from 'blockchain-wallet-v4/src'
import {
  ApiSocket,
  createWalletApi,
  HorizonStreamingService,
  Socket,
} from 'blockchain-wallet-v4/src/network/index.ts'
import { serializer } from 'blockchain-wallet-v4/src/types'
import { actions, rootReducer, rootSaga, selectors } from 'data'

import {
  analyticsMiddleware,
  autoDisconnection,
  matomoMiddleware,
  streamingXlm,
  webSocketCoins,
  webSocketRates,
} from '../middleware'

const devToolsConfig = {
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
    '@CORE.COINS_WEBSOCKET_MESSAGE',
    '@CORE.FETCH_ETH_LATEST_BLOCK_SUCCESS',
    '@EVENT.RATES_SOCKET.WEBSOCKET_MESSAGE',
  ],
  maxAge: 1000,
  serialize: serializer,
}

const configureStore = async function () {
  const history = createHashHistory()
  const sagaMiddleware = createSagaMiddleware()
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(devToolsConfig)
    : compose
  const walletPath = 'wallet.payload'
  const kvStorePath = 'wallet.kvstore'
  const { isAuthenticated } = selectors.auth

  const res = await fetch('/wallet-options-v4.json')
  const options = await res.json()
  const apiKey = '1770d5d9-bcea-4d28-ad21-6cbd5be018a8'
  const socketUrl = options.domains.webSocket
  const horizonUrl = options.domains.horizon
  const coinsSocket = new Socket({
    options,
    url: `${socketUrl}/coins`,
  })
  const ratesSocket = new ApiSocket({
    maxReconnects: 3,
    options,
    url: `${socketUrl}/nabu-gateway/markets/quotes`,
  })
  const xlmStreamingService = new HorizonStreamingService({
    url: horizonUrl,
  })
  const getAuthCredentials = () => selectors.modules.profile.getAuthCredentials(store.getState())
  const reauthenticate = () => store.dispatch(actions.modules.profile.signIn())
  const networks = {
    bch: BitcoinCash.networks[options.platforms.web.coins.BTC.config.network],
    btc: Bitcoin.networks[options.platforms.web.coins.BTC.config.network],
    eth: options.platforms.web.coins.ETH.config.network,
    xlm: options.platforms.web.coins.XLM.config.network,
  }
  const api = createWalletApi({
    apiKey,
    getAuthCredentials,
    networks,
    options,
    reauthenticate,
  })
  const persistWhitelist = ['session', 'preferences', 'cache']

  // TODO: remove getStoredStateMigrateV4 someday (at least a year from now)
  const store = createStore(
    connectRouter(history)(
      persistCombineReducers(
        {
          getStoredState: getStoredStateMigrateV4({
            whitelist: persistWhitelist,
          }),
          key: 'root',
          storage,
          whitelist: persistWhitelist,
        },
        {
          router: connectRouter(history),
          ...rootReducer,
        }
      )
    ),
    composeEnhancers(
      applyMiddleware(
        sagaMiddleware,
        routerMiddleware(history),
        coreMiddleware.kvStore({ api, isAuthenticated, kvStorePath }),
        streamingXlm(xlmStreamingService, api),
        webSocketRates(ratesSocket),
        webSocketCoins(coinsSocket),
        coreMiddleware.walletSync({ api, isAuthenticated, walletPath }),
        matomoMiddleware(),
        analyticsMiddleware(),
        autoDisconnection()
      )
    )
  )
  const persistor = persistStore(store, null)

  sagaMiddleware.run(rootSaga, {
    api,
    coinsSocket,
    networks,
    options,
    ratesSocket,
  })

  // expose globals here
  window.createTestXlmAccounts = () => {
    store.dispatch(actions.core.data.xlm.createTestAccounts())
  }

  store.dispatch(actions.goals.defineGoals())

  return {
    history,
    persistor,
    store,
  }
}

export default configureStore
