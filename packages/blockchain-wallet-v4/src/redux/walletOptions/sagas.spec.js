import { testSaga } from 'redux-saga-test-plan'

import * as A from './actions'
import MockWalletOptions from '../../../../../config/mocks/wallet-options-v4.json'
import sagas from './sagas'

const api = {
  getWalletOptions: jest.fn(() => MockWalletOptions)
}

describe('Wallet Options saga', () => {
  const walletOptionsSagas = sagas({ api })

  describe('fetchOptions', () => {
    const saga = testSaga(walletOptionsSagas.fetchOptions)

    it('should put loading state', () => {
      saga.next().put(A.fetchOptionsLoading())
    })

    it('should fetch wallet options', () => {
      saga.next().call(api.getWalletOptions)
    })

    it('should dispatch success with data', () => {
      saga.next(MockWalletOptions).put(A.fetchOptionsSuccess(MockWalletOptions))
    })

    it('should finish', () => {
      saga.next().isDone()
    })

    it('should handle errors', () => {
      const error = { message: 'failed to wallet options' }
      saga
        .restart()
        .next()
        .throw(error)
        .put(A.fetchOptionsFailure(error.message))
        .next()
        .isDone()
    })
  })
})
