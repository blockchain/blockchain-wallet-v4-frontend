// Do we still need this?
// import * as Redux from 'redux'
// import { persistStore } from 'redux-persist'

// import { ApiSocket, createWalletApi, Socket } from 'blockchain-wallet-v4/src/network'
// import * as coreMiddleware from 'blockchain-wallet-v4/src/redux/middleware'

// import * as Middleware from '../middleware'
// import configureStore from './index'
// // setup mocks
// jest.mock('redux-saga', () => () => ({
//   run: () => jest.fn()
// }))

// jest.mock('redux-persist', () => ({
//   persistCombineReducers: jest.fn(),
//   persistStore: jest.fn()
// }))

// jest.mock('connected-react-router', () => ({
//   connectRouter: () => () => jest.fn(),
//   routerMiddleware: jest.fn()
// }))

// jest.mock('blockchain-wallet-v4/src/network', () => ({
//   ApiSocket: jest.fn().mockImplementation(() => 'FAKE_API_SOCKET'),
//   HorizonStreamingService: jest.fn(),
//   Socket: jest.fn().mockImplementation(() => 'FAKE_SOCKET'),
//   createWalletApi: jest.fn().mockImplementation(() => 'FAKE_WALLET_API')
// }))

// jest.mock('blockchain-wallet-v4/src/redux/middleware', () => ({
//   kvStore: jest.fn(),
//   walletSync: jest.fn()
// }))

// jest.mock('../middleware', () => ({
//   analyticsMiddleware: jest.fn(),
//   autoDisconnection: jest.fn(),
//   matomoMiddleware: jest.fn(),
//   streamingXlm: jest.fn(),
//   webSocketCoins: jest.fn(),
//   webSocketRates: jest.fn()
// }))

// describe('App Store Config', () => {
//   const apiKey = '1770d5d9-bcea-4d28-ad21-6cbd5be018a8'
//   const fakeWalletOptions = {
//     domains: { root: 'MOCK_ROOT', webSocket: 'MOCK_SOCKET' },
//     platforms: {
//       web: {
//         coins: {
//           BTC: { config: { network: 'bitcoin' } },
//           ETH: { config: { network: 1 } },
//           XLM: { config: { network: 'public' } }
//         }
//       }
//     }
//   }
//   const mockNetworks = {
//     bch: {
//       bech32: 'bc',
//       bip32: { private: 76066276, public: 76067358 },
//       messagePrefix: '\u0018Bitcoin Signed Message:\n',
//       pubKeyHash: 0,
//       scriptHash: 5,
//       wif: 128
//     },
//     btc: {
//       bip32: { private: 76066276, public: 76067358 },
//       messagePrefix: '\u0018Bitcoin Signed Message:\n',
//       pubKeyHash: 0,
//       scriptHash: 5,
//       wif: 128
//     },
//     eth: 1
//   }
//   let createStoreSpy
//   let applyMiddlewareSpy
//   let composeSpy
//   let kvStoreSpy
//   let walletSyncSpy
//   let autoDisconnectSpy
//   let matomoMiddlewareSpy
//   let analyticsMiddlewareSpy
//   let coinsSocketSpy

//   beforeAll(() => {
//     // setup fetch mock
//     fetch.resetMocks()
//     fetch.mockResponseOnce(JSON.stringify(fakeWalletOptions))

//     // setup spies
//     createStoreSpy = jest.spyOn(Redux, 'createStore')
//     applyMiddlewareSpy = jest.spyOn(Redux, 'applyMiddleware')
//     composeSpy = jest.spyOn(Redux, 'compose').mockImplementation(jest.fn())
//     kvStoreSpy = jest.spyOn(coreMiddleware, 'kvStore')
//     walletSyncSpy = jest.spyOn(coreMiddleware, 'walletSync')
//     coinsSocketSpy = jest.spyOn(Middleware, 'webSocketCoins')
//     matomoMiddlewareSpy = jest.spyOn(Middleware, 'matomoMiddleware')
//     analyticsMiddlewareSpy = jest.spyOn(Middleware, 'analyticsMiddleware')
//     autoDisconnectSpy = jest.spyOn(Middleware, 'autoDisconnection')
//   })

//   it('the entire app should bootstrap correctly', async () => {
//     // bootstrap
//     const mockStore = await configureStore()

//     // assertions
//     // wallet options
//     expect(fetch.mock.calls).toHaveLength(1)
//     expect(fetch.mock.calls[0][0]).toEqual('/wallet-options-v4.json')
//     // socket registration
//     expect(Socket.mock.calls).toHaveLength(1)
//     expect(Socket.mock.calls[0][0]).toEqual({
//       options: fakeWalletOptions,
//       url: `${fakeWalletOptions.domains.webSocket}/coins`
//     })
//     expect(ApiSocket).toHaveBeenCalledTimes(1)
//     expect(ApiSocket).toHaveBeenCalledWith({
//       maxReconnects: 3,
//       options: fakeWalletOptions,
//       url: `${fakeWalletOptions.domains.webSocket}/nabu-gateway/markets/quotes`
//     })
//     // build api
//     expect(createWalletApi.mock.calls).toHaveLength(1)
//     expect(createWalletApi.mock.calls[0][0]).toMatchObject({
//       apiKey,
//       networks: mockNetworks,
//       options: fakeWalletOptions
//     })
//     // middleware registration
//     expect(kvStoreSpy).toHaveBeenCalledTimes(1)
//     expect(kvStoreSpy).toHaveBeenCalledWith({
//       api: 'FAKE_WALLET_API',
//       isAuthenticated: expect.any(Function),
//       kvStorePath: 'wallet.kvstore'
//     })

//     expect(coinsSocketSpy).toHaveBeenCalledTimes(1)
//     expect(coinsSocketSpy).toHaveBeenCalledWith(expect.any(Object))

//     expect(walletSyncSpy).toHaveBeenCalledTimes(1)
//     expect(walletSyncSpy).toHaveBeenCalledWith({
//       api: 'FAKE_WALLET_API',
//       isAuthenticated: expect.any(Function),
//       walletPath: 'wallet.payload'
//     })
//     expect(matomoMiddlewareSpy).toHaveBeenCalledTimes(1)
//     expect(analyticsMiddlewareSpy).toHaveBeenCalledTimes(1)
//     expect(autoDisconnectSpy).toHaveBeenCalledTimes(1)
//     // middleware compose
//     expect(composeSpy).toHaveBeenCalledTimes(1)
//     expect(applyMiddlewareSpy).toHaveBeenCalledTimes(1)
//     // store creation
//     expect(createStoreSpy).toHaveBeenCalledTimes(1)
//     expect(persistStore.mock.calls).toHaveLength(1)
//     expect(persistStore.mock.calls[0][0]).toEqual(expect.any(Object))
//     expect(persistStore.mock.calls[0][1]).toBeNull()
//     expect(mockStore.history).toBeDefined()
//     expect(mockStore.store).toBeDefined()
//   })
// })
