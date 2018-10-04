import configureStore from './index'
import * as Redux from 'redux'
import * as CoreSrc from 'blockchain-wallet-v4/src'
import * as Middleware from '../middleware'
import {
  createWalletApi,
  ApiSocket,
  Socket
} from 'blockchain-wallet-v4/src/network'
import { persistStore, autoRehydrate } from 'redux-persist'
// setup mocks
jest.mock('redux-saga', () => () => {
  return {
    run: () => {
      jest.fn()
    }
  }
})

jest.mock('redux-persist', () => {
  return {
    autoRehydrate: jest.fn(),
    persistStore: jest.fn()
  }
})

jest.mock('connected-react-router', () => {
  return {
    connectRouter: () => () => jest.fn(),
    routerMiddleware: jest.fn()
  }
})

jest.mock('blockchain-wallet-v4/src/network', () => {
  return {
    Socket: jest.fn().mockImplementation(() => 'FAKE_SOCKET'),
    ApiSocket: jest.fn().mockImplementation(() => 'FAKE_API_SOCKET'),
    createWalletApi: jest.fn().mockImplementation(() => 'FAKE_WALLET_API')
  }
})

jest.mock('config', () => {
  return {
    WALLET_PAYLOAD_PATH: 'MOCK_WALLET_PATH',
    WALLET_KVSTORE_PATH: 'MOCK_KVSTORE_PATH'
  }
})

describe('App Store Config', () => {
  let apiKey = '1770d5d9-bcea-4d28-ad21-6cbd5be018a8'
  let fakeWalletOptions = {
    domains: { webSocket: 'wss://ws.blockchain.info', root: 'MOCK_ROOT' },
    platforms: {
      web: {
        bitcoin: {
          config: { network: 'bitcoin' }
        },
        ethereum: {
          config: { network: 1 }
        }
      }
    }
  }
  let mockNetworks = {
    bch: {
      bech32: 'bc',
      bip32: { private: 76066276, public: 76067358 },
      messagePrefix: '\u0018Bitcoin Signed Message:\n',
      pubKeyHash: 0,
      scriptHash: 5,
      wif: 128
    },
    btc: {
      bip32: { private: 76066276, public: 76067358 },
      messagePrefix: '\u0018Bitcoin Signed Message:\n',
      pubKeyHash: 0,
      scriptHash: 5,
      wif: 128
    },
    eth: 1
  }
  let createStoreSpy,
    applyMiddlewareSpy,
    composeSpy,
    kvStoreSpy,
    walletSyncSpy,
    autoDisconnectSpy,
    btcSocketSpy,
    bchSocketSpy,
    ethSocketSpy

  beforeAll(() => {
    // setup fetch mock
    fetch.resetMocks()
    fetch.mockResponseOnce(JSON.stringify(fakeWalletOptions))

    // setup spies
    createStoreSpy = jest.spyOn(Redux, 'createStore')
    applyMiddlewareSpy = jest.spyOn(Redux, 'applyMiddleware')
    composeSpy = jest.spyOn(Redux, 'compose').mockImplementation(jest.fn())
    kvStoreSpy = jest.spyOn(CoreSrc.coreMiddleware, 'kvStore')
    walletSyncSpy = jest.spyOn(CoreSrc.coreMiddleware, 'walletSync')
    btcSocketSpy = jest.spyOn(Middleware, 'webSocketBtc')
    bchSocketSpy = jest.spyOn(Middleware, 'webSocketBch')
    ethSocketSpy = jest.spyOn(Middleware, 'webSocketEth')
    autoDisconnectSpy = jest.spyOn(Middleware, 'autoDisconnection')
  })

  it('the entire app should bootstrap correctly', async () => {
    // bootstrap
    let mockStore = await configureStore()

    // assertions
    // wallet options
    expect(fetch.mock.calls.length).toEqual(1)
    expect(fetch.mock.calls[0][0]).toEqual('/Resources/wallet-options-v4.json')
    // socket registration
    expect(Socket.mock.calls.length).toEqual(3)
    expect(Socket.mock.calls[0][0]).toEqual({
      options: fakeWalletOptions,
      url: `${fakeWalletOptions.domains.webSocket}/inv`
    })
    expect(Socket.mock.calls[1][0]).toEqual({
      options: fakeWalletOptions,
      url: `${fakeWalletOptions.domains.webSocket}/bch/inv`
    })
    expect(Socket.mock.calls[2][0]).toEqual({
      options: fakeWalletOptions,
      url: `${fakeWalletOptions.domains.webSocket}/eth/inv`
    })
    expect(ApiSocket).toHaveBeenCalledTimes(1)
    expect(ApiSocket).toHaveBeenCalledWith({
      options: fakeWalletOptions,
      url: `${fakeWalletOptions.domains.webSocket}/nabu-gateway/markets/quotes`,
      maxReconnects: 3
    })
    // build api
    expect(createWalletApi.mock.calls.length).toBe(1)
    expect(createWalletApi.mock.calls[0][0]).toMatchObject({
      options: fakeWalletOptions,
      networks: mockNetworks,
      apiKey: apiKey
    })
    // middleware registration
    expect(kvStoreSpy).toHaveBeenCalledTimes(1)
    expect(kvStoreSpy).toHaveBeenCalledWith({
      isAuthenticated: expect.any(Function),
      api: 'FAKE_WALLET_API',
      kvStorePath: 'MOCK_KVSTORE_PATH'
    })
    expect(btcSocketSpy).toHaveBeenCalledTimes(1)
    expect(btcSocketSpy).toHaveBeenCalledWith(expect.any(Object))
    expect(bchSocketSpy).toHaveBeenCalledTimes(1)
    expect(bchSocketSpy).toHaveBeenCalledWith(expect.any(Object))
    expect(ethSocketSpy).toHaveBeenCalledTimes(1)
    expect(ethSocketSpy).toHaveBeenCalledWith(expect.any(Object))
    expect(walletSyncSpy).toHaveBeenCalledTimes(1)
    expect(walletSyncSpy).toHaveBeenCalledWith({
      isAuthenticated: expect.any(Function),
      api: 'FAKE_WALLET_API',
      walletPath: 'MOCK_WALLET_PATH'
    })
    expect(autoDisconnectSpy).toHaveBeenCalledTimes(1)
    // middleware compose
    expect(composeSpy).toHaveBeenCalledTimes(1)
    expect(applyMiddlewareSpy).toHaveBeenCalledTimes(1)
    expect(autoRehydrate.mock.calls.length).toBe(1)
    // store creation
    expect(createStoreSpy).toHaveBeenCalledTimes(1)
    expect(persistStore.mock.calls.length).toBe(1)
    expect(persistStore.mock.calls[0][0]).toEqual(expect.any(Object))
    expect(persistStore.mock.calls[0][1]).toEqual({
      whitelist: ['session', 'preferences', 'cache']
    })
    expect(mockStore.history).toBeDefined()
    expect(mockStore.store).toBeDefined()
  })
})
