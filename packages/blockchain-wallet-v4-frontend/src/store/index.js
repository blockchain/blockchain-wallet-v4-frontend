import { actions, rootReducer, rootSaga, selectors } from 'data'
import {
  ApiSocket,
  createWalletApi,
  HorizonStreamingService,
  Socket
} from 'blockchain-wallet-v4/src/network/index.ts'
import { applyMiddleware, compose, createStore } from 'redux'
import {
  autoDisconnection,
  matomoMiddleware,
  streamingXlm,
  webSocketCoins,
  webSocketRates
} from '../middleware'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { coreMiddleware } from 'blockchain-wallet-v4/src'
import { createHashHistory } from 'history'
import { head } from 'ramda'
import { persistCombineReducers, persistStore } from 'redux-persist'
import { serializer } from 'blockchain-wallet-v4/src/types'
import Bitcoin from 'bitcoinjs-lib'
import BitcoinCash from 'bitcoinforksjs-lib'
import createSagaMiddleware from 'redux-saga'
import getStoredStateMigrateV4 from 'redux-persist/lib/integration/getStoredStateMigrateV4'
import storage from 'redux-persist/lib/storage'

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
    // '@@redux-form/RESET'
  ]
}

const configureStore = () => {
  const history = createHashHistory()
  const sagaMiddleware = createSagaMiddleware()
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(devToolsConfig)
    : compose
  const walletPath = 'wallet.payload'
  const kvStorePath = 'wallet.kvstore'
  const isAuthenticated = selectors.auth.isAuthenticated

  return fetch('/Resources/wallet-options-v4.json')
    .then(res => res.json())
    .then(options => {
      const apiKey = '1770d5d9-bcea-4d28-ad21-6cbd5be018a8'
      // TODO: deprecate when wallet-options-v4 is updated on prod
      const socketUrl = head(options.domains.webSocket.split('/inv'))
      const horizonUrl = options.domains.horizon
      const coinsSocket = new Socket({
        options,
        url: `${socketUrl}/coins`
      })
      const ratesSocket = new ApiSocket({
        options,
        url: `${socketUrl
          .split('/coins')
          .join('')}/nabu-gateway/markets/quotes`,
        maxReconnects: 3
      })
      const xlmStreamingService = new HorizonStreamingService({
        url: horizonUrl
      })
      const getAuthCredentials = () =>
        selectors.modules.profile.getAuthCredentials(store.getState())
      const reauthenticate = () =>
        store.dispatch(actions.modules.profile.signIn())
      const networks = {
        btc: Bitcoin.networks[options.platforms.web.coins.BTC.config.network],
        bch:
          BitcoinCash.networks[options.platforms.web.coins.BTC.config.network],
        eth: options.platforms.web.coins.ETH.config.network,
        xlm: options.platforms.web.coins.XLM.config.network
      }
      const api = createWalletApi({
        options,
        apiKey,
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
                whitelist: persistWhitelist
              }),
              key: 'root',
              storage,
              whitelist: persistWhitelist
            },
            rootReducer
          )
        ),
        composeEnhancers(
          applyMiddleware(
            sagaMiddleware,
            routerMiddleware(history),
            coreMiddleware.kvStore({ isAuthenticated, api, kvStorePath }),
            streamingXlm(xlmStreamingService, api),
            webSocketRates(ratesSocket),
            webSocketCoins(coinsSocket),
            coreMiddleware.walletSync({ isAuthenticated, api, walletPath }),
            matomoMiddleware(),
            autoDisconnection()
          )
        )
      )
      const persistor = persistStore(store, null)

      sagaMiddleware.run(rootSaga, {
        api,
        ratesSocket,
        networks,
        options,
        coinsSocket
      })

      // expose globals here
      window.createTestXlmAccounts = () => {
        store.dispatch(actions.core.data.xlm.createTestAccounts())
      }

      store.dispatch(actions.goals.defineGoals())

      return {
        store,
        history,
        persistor
      }
    })
}

export default configureStore
