import { testSaga } from 'redux-saga-test-plan'
import { Remote } from 'blockchain-wallet-v4/src'
import * as A from './actions'
import { selectors } from 'data'
import sagas from './sagas'

const mockPairs = [
  'XLM-BCH',
  'BCH-BTC',
  'XLM-BTC',
  'ETH-XLM',
  'BTC-XLM',
  'BTC-ETH',
  'ETH-BCH',
  'ETH-BTC',
  'BTC-BCH',
  'BCH-XLM',
  'BCH-ETH',
  'XLM-ETH'
]

const mockCoinAvailability = coin =>
  Remote.of({ exchangeFrom: true, exchangeTo: true })

const api = {
  fetchAvailablePairs: jest.fn(() => mockPairs)
}

describe('Exchanges rates sagas', () => {
  const exchangeRatesSagas = sagas({ api })
  const saga = testSaga(exchangeRatesSagas.fetchAvailablePairs)

  describe('fetchAvailablePairs should return pairs', () => {
    it('should put loading state', () => {
      saga.next().put(A.availablePairsLoading())
    })

    it('should call for available exchange pairs', () => {
      saga.next().call(api.fetchAvailablePairs)
    })

    it('should call for enabled coins from wallet options', () => {
      saga
        .next({ pairs: mockPairs })
        .select(selectors.core.walletOptions.getCoinAvailability)
    })
    it('should set available pairs', () => {
      saga.next(mockCoinAvailability).put(A.availablePairsSuccess(mockPairs))
    })
  })

  describe('fetchAvailablePairs error handler', () => {
    it('should handle errors', () => {
      const error = { message: 'failed to fetch pairs' }
      saga
        .restart()
        .next()
        .throw(error)
        .put(A.availablePairsError(error))
        .next()
        .isDone()
    })
  })
})
