import configureStore from './index'
import * as Redux from 'redux'
import * as CoreSrc from 'blockchain-wallet-v4/src'
import * as Middleware from '../middleware'
import { createWalletApi, Socket } from 'blockchain-wallet-v4/src/network'
import { persistStore, autoRehydrate } from 'redux-persist'

// setup mocks
jest.mock('redux-saga', () => () => {
  return { run: () => { jest.fn() } }
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
  let fakeWalletOptions = { domains: { webSocket: 'MOCK_SOCKET', root: 'MOCK_ROOT' } }
  let createStoreSpy, applyMiddlewareSpy, composeSpy, kvStoreSpy, btcSocketSpy, walletSyncSpy, autoDisconnectSpy

  beforeAll(() => {
    // setup fetch mock
    fetch.resetMocks()
    fetch.mockResponseOnce(JSON.stringify(fakeWalletOptions))

    // setup spies
    createStoreSpy = jest.spyOn(Redux, 'createStore')
    applyMiddlewareSpy = jest.spyOn(Redux, 'applyMiddleware')
    composeSpy = jest.spyOn(Redux, 'compose').mockImplementation(jest.fn())
    kvStoreSpy = jest.spyOn(CoreSrc.coreMiddleware, 'kvStore')
    btcSocketSpy = jest.spyOn(CoreSrc.coreMiddleware.socket, 'bitcoin')
    walletSyncSpy = jest.spyOn(CoreSrc.coreMiddleware, 'walletSync')
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
    expect(Socket.mock.calls.length).toEqual(1)
    expect(Socket.mock.calls[0][0]).toEqual({ options: fakeWalletOptions })
    // build api
    expect(createWalletApi.mock.calls.length).toBe(1)
    expect(createWalletApi.mock.calls[0][0]).toEqual({
      options: fakeWalletOptions,
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
    expect(btcSocketSpy).toHaveBeenCalledWith(expect.any(Object), 'MOCK_WALLET_PATH', expect.any(Function))
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
    expect(persistStore.mock.calls[0][1]).toEqual({ whitelist: ['session', 'preferences', 'cache'] })
    expect(mockStore.history).toBeDefined()
    expect(mockStore.store).toBeDefined()
  })
})
