/* eslint-disable */
import BitcoinCash from 'bitcoinforksjs-lib'
import * as Bitcoin from 'bitcoinjs-lib'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { createHashHistory } from 'history'
import { persistCombineReducers, persistStore } from 'redux-persist'
import { configureStore } from '@reduxjs/toolkit'
import { compose } from 'redux'
import getStoredStateMigrateV4 from 'redux-persist/lib/integration/getStoredStateMigrateV4'
import storage from 'redux-persist/lib/storage'
import createSagaMiddleware from 'redux-saga'

import { coreMiddleware } from '@core'
import { ApiSocket, createWalletApi, HorizonStreamingService, Socket } from '@core/network/index.ts'
import { serializer } from '@core/types'
import { actions, rootReducer, rootSaga, selectors } from 'data'

import {
  analyticsMiddleware,
  autoDisconnection,
  streamingXlm,
  webSocketCoins,
  webSocketRates
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
    '@EVENT.RATES_SOCKET.WEBSOCKET_MESSAGE'
  ],
  maxAge: 1000,
  serialize: serializer
}

const configuredStore = async function () {
  const history = createHashHistory()
  const sagaMiddleware = createSagaMiddleware()
  const walletPath = 'wallet.payload'
  const kvStorePath = 'wallet.kvstore'
  const { isAuthenticated } = selectors.auth

  let res;
  let options;
  let assetsRes;
  let assets;
  let erc20Res;
  let erc20s;
  
  try {
    res = await fetch('/wallet-options-v4.json')
    options = await res.json()
  } catch (error) {
    throw new Error('wallet-options failed to load.')
  }
  try {
    assetsRes = await fetch(`${options.domains.api}/assets/currencies/custodial`)
    assets = await assetsRes.json()
    if(!assets.currencies) throw new Error()
  } catch (error) {
    throw new Error('custodial currencies failed to load.')
  }
  try {
    erc20Res = await fetch(`${options.domains.api}/assets/currencies/erc20`)
    erc20s = await erc20Res.json()
    if(!erc20s.currencies) throw new Error()
  } catch (error) {
    throw new Error('erc20 currencies failed to load.')
  }

  const erc20Whitelist = options.platforms.web.erc20s

  let supportedCoins = assets.currencies
  let supportedErc20s = erc20s.currencies
  if (erc20Whitelist) {
    supportedCoins = supportedCoins.filter(({ type, symbol }) =>
      type.name !== 'ERC20' ? true : erc20Whitelist.indexOf(symbol) >= 0
    )
    supportedErc20s = []
  }

  window.coins = {
    ...supportedCoins.reduce((acc, curr) => {
      if (curr.symbol.includes('.')) return acc
      return {
        ...acc,
        [curr.symbol]: { coinfig: curr }
      }
    }, {}),
    ...supportedErc20s.reduce((acc, curr) => {
      if (curr.symbol.includes('.')) return acc
      return {
        ...acc,
        [curr.symbol]: { coinfig: curr }
      }
    }, {})
  }

  // TODO: remove this
  window.coins.XLM.coinfig.type.isMemoBased = true

  // Switch up the erc20 addresses to support testnet (for opensea testing)
  if (options.domains.opensea && options.domains.opensea.includes('rinkeby')) {
    window.coins.WETH.coinfig.type.erc20Address = '0xc778417E063141139Fce010982780140Aa0cD5Ab'
    window.coins.DAI.coinfig.type.erc20Address = '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45'
  }

  window.coins.STX.coinfig.products.push('DynamicSelfCustody')

  const apiKey = '1770d5d9-bcea-4d28-ad21-6cbd5be018a8'
  const socketUrl = options.domains.webSocket
  const horizonUrl = options.domains.horizon
  const coinsSocket = new Socket({
    options,
    url: `${socketUrl}/coins`
  })
  const ratesSocket = new ApiSocket({
    maxReconnects: 3,
    options,
    url: `${socketUrl}/nabu-gateway/markets/quotes`
  })
  const xlmStreamingService = new HorizonStreamingService({
    url: horizonUrl
  })
  const getAuthCredentials = () => selectors.modules.profile.getAuthCredentials(store.getState())
  const reauthenticate = () => store.dispatch(actions.modules.profile.signIn())
  const networks = {
    bch: BitcoinCash.networks.bitcoin,
    btc: Bitcoin.networks.bitcoin,
    eth: 1,
    xlm: 'public'
  }
  const api = createWalletApi({
    apiKey,
    getAuthCredentials,
    networks,
    options,
    reauthenticate
  })
  const persistWhitelist = ['session', 'preferences', 'cache']
  const store = configureStore({
    devTools: devToolsConfig,
    middleware: compose([
      sagaMiddleware,
      routerMiddleware(history),
      coreMiddleware.kvStore({ api, isAuthenticated, kvStorePath }),
      streamingXlm(xlmStreamingService, api),
      webSocketRates(ratesSocket),
      webSocketCoins(coinsSocket),
      coreMiddleware.walletSync({ api, isAuthenticated, walletPath }),
      analyticsMiddleware(),
      autoDisconnection()
    ]),
    reducer: connectRouter(history)(
      persistCombineReducers(
        {
          getStoredState: getStoredStateMigrateV4({
            whitelist: persistWhitelist
          }),
          key: 'root',
          storage,
          whitelist: persistWhitelist
        },
        {
          router: connectRouter(history),
          ...rootReducer
        }
      )
    )
  })

  const persistor = persistStore(store, null)

  sagaMiddleware.run(rootSaga, {
    api,
    coinsSocket,
    networks,
    options,
    ratesSocket
  })

  // expose globals here
  window.createTestXlmAccounts = () => {
    store.dispatch(actions.core.data.xlm.createTestAccounts())
  }

  store.dispatch(actions.goals.defineGoals())

  return {
    history,
    persistor,
    store
  }
}

export default configuredStore
