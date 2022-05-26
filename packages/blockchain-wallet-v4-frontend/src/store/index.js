/* eslint-disable */
import BitcoinCash from 'bitcoinforksjs-lib'
import * as Bitcoin from 'bitcoinjs-lib'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { createHashHistory } from 'history'
import { persistCombineReducers, persistStore } from 'redux-persist'
import { configureStore } from '@reduxjs/toolkit'
import { compose } from 'redux'
import storage from 'redux-persist/lib/storage'
import createSagaMiddleware from 'redux-saga'
import Worker from 'web-worker'

import { coreMiddleware } from '@core'
import { ApiSocket, createWalletApi, HorizonStreamingService, Socket } from '@core/network'
import { serializer } from '@core/types'
import { actions, rootReducer, rootSaga, selectors } from 'data'
import { isBrowserSupported } from 'services/browser'

import {
  analyticsMiddleware,
  streamingXlm,
  webSocketCoins,
  webSocketRates
} from '../middleware'

const manuallyRouteToErrorPage = (error) => {
  if (window.history.replaceState) {
    window.history.replaceState(null, '', `#app-error?error=${error}`)
  } else {
    window.location.hash = `#app-error?error=${error}`
  }
}

const configuredStore = async function () {
  // immediately load app configuration
  let options
  try {
    let res = await fetch('/wallet-options-v4.json')
    options = await res.json()
  } catch (e) {
    throw new Error('errorWalletOptionsApi')
  }

  // ensure browser is supported
  const browserSupported = isBrowserSupported()
  if (!browserSupported) {
    manuallyRouteToErrorPage('unsupportedBrowser')
  }

  // offload asset configuration fetch/parse from main thread
  if (window.Worker) {
    const url = new URL('./worker.assets.js', import.meta.url)
    const worker = new Worker(url)

    // set event listener upon worker completion
    worker.addEventListener('message', e => {
      try {
        // message response is json string, parse and set coins on window
        window.coins = JSON.parse(e.data)
      } catch (e) {
        // failed to parse json, meaning there was an error
        manuallyRouteToErrorPage('errorAssetsApi')
      }
    })

    // start worker with stringified args since some browsers only support passing strings as args
    worker.postMessage(JSON.stringify({
      assetApi: options.domains.api,
      openSeaApi: options.domains.opensea
    }))
  } else {
    manuallyRouteToErrorPage('unsupportedBrowser')
  }

  // initialize router and saga middleware
  const history = createHashHistory()
  const sagaMiddleware = createSagaMiddleware()
  const { isAuthenticated } = selectors.auth
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
    apiKey: '1770d5d9-bcea-4d28-ad21-6cbd5be018a8',
    getAuthCredentials,
    networks,
    options,
    reauthenticate
  })
  const persistWhitelist = ['session', 'preferences', 'cache']
  const store = configureStore({
    devTools: {
      actionsDenylist: [
        '@CORE.COINS_WEBSOCKET_MESSAGE',
        '@CORE.FETCH_ETH_LATEST_BLOCK_SUCCESS',
        '@EVENT.RATES_SOCKET.WEBSOCKET_MESSAGE',
        'misc/pingManifestFile'
      ],
      maxAge: 1000,
      serialize: serializer
    },
    middleware: compose([
      sagaMiddleware,
      routerMiddleware(history),
      coreMiddleware.kvStore({ api, isAuthenticated, kvStorePath: 'wallet.kvstore' }),
      streamingXlm(xlmStreamingService, api),
      webSocketRates(ratesSocket),
      webSocketCoins(coinsSocket),
      coreMiddleware.walletSync({ api, isAuthenticated, walletPath: 'wallet.payload' }),
      analyticsMiddleware()
    ]),
    reducer: connectRouter(history)(
      persistCombineReducers(
        {
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

  store.dispatch(actions.goals.defineGoals())

  return {
    history,
    persistor,
    store
  }
}

export default configuredStore
