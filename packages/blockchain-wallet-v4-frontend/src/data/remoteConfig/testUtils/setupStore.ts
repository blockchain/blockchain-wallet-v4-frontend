import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'

import { remoteConfigReducer, remoteConfigSaga } from 'data/remoteConfig'

export const setupStore = () => {
  const apiStub = {
    activateRemoteConfig: jest.fn(),
    fetchAndCacheRemoteConfig: jest.fn(),
    getRemoteConfig: jest.fn()
  }

  const sagaMiddleware = createSagaMiddleware({
    context: {
      api: apiStub
    }
  })

  const store = configureStore({
    middleware: [sagaMiddleware],
    reducer: { remoteConfig: remoteConfigReducer }
  })

  sagaMiddleware.run(remoteConfigSaga)

  return {
    apiStub,
    store
  }
}
