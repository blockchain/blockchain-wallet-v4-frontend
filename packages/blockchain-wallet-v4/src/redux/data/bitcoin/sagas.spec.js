import { call, put, select, take } from 'redux-saga/effects'
import { indexBy, length, last, path, prop } from 'ramda'
import * as A from './actions'
import * as AT from './actionTypes'
import * as S from './selectors'
import * as selectors from '../../selectors'

import { expectSaga, testSaga } from 'redux-saga-test-plan'
import sagas from './sagas'

const blockchainData = { wallet: {}, info: {}}

const api = {
  fetchBlockchainData: jest.fn(() => blockchainData),
  getBitcoinFee: jest.fn(),
  getBitcoinTicker: jest.fn()
}

describe('bitcoin data sagas', () => {
  const dataBtcSagas = sagas({api})

  describe('fetchData', () => {
    const mockContext = 'xpub6BvQUYyon9wcJUgBUjhQ7E5iSSHVzsraSqmqiRLKUXoXE4PkFZ2h8x'
    const data = {
      addresses: [{
        address: 'xpub6BvQUYyon9wcJUgBUjhQ7E5iSSHVzsraSqmqiRLKUXoXE4PkFZ2h8x7yuuXZdFeJSQgTX2o8n4kq4z32aGFkfkC6ZBrW9hJR1jDuEdA7uJa'
      }],
      wallet: {},
      info: {
        latest_block: {}
      }
    }
    const bitcoinData = {
      addresses: indexBy(prop('address'), prop('addresses', data)),
      info: path(['wallet'], data),
      latest_block: path(['info', 'latest_block'], data)
    }

    const saga = testSaga(dataBtcSagas.fetchData)

    it('should put loading state', () => {
      saga.next().put(A.fetchDataLoading())
    })

    it('should select wallet', () => {
      saga.next()
        .select(selectors.wallet.getContext)
    })

    it('should get data from api', () => {
      saga.next(mockContext)
        .call(api.fetchBlockchainData, mockContext, { n: 1 })
    })

    it('should dispatch success action', () => {
      saga.next(data)
        .put(A.fetchDataSuccess(bitcoinData))
        .next()
        .isDone()
    })

    it('should handle errors', () => {
      const error = { message: 'asdf' }

      saga.restart()
        .next()
        .throw(error)
        .put(A.fetchDataFailure(error.message))
        .next()
        .isDone()
    })
  })

  describe('fetchFee', () => {
    const saga = testSaga(dataBtcSagas.fetchFee)
    const feeData = { fee: 2 }

    it('should put loading state', () => {
      saga.next().put(A.fetchFeeLoading())
    })

    it('should retrieve fee data', () => {
      saga.next().call(api.getBitcoinFee)
    })

    it('should dispatch succes with data', () => {
      saga.next(feeData).put(A.fetchFeeSuccess(feeData)).next().isDone()
    })

    it('should handle errors', () => {
      const error = { message: 'asdf' }

      saga.restart()
        .next()
        .throw(error)
        .put(A.fetchFeeFailure(error.message))
        .next()
        .isDone()
    })
  })

  describe('fetchRates', () => {
    const saga = testSaga(dataBtcSagas.fetchRates)
    const rateData = { rate: 1 }

    it('should put loading state', () => {
      saga.next().put(A.fetchRatesLoading())
    })

    it('should retrieve rates data', () => {
      saga.next().call(api.getBitcoinTicker)
    })

    it('should dispatch succes with data', () => {
      saga.next(rateData).put(A.fetchRatesSuccess(rateData)).next().isDone()
    })

    it('should handle errors', () => {
      const error = { message: 'asdf' }

      saga.restart()
        .next()
        .throw(error)
        .put(A.fetchRatesFailure(error.message))
        .next()
        .isDone()
    })
  })

  describe('watchTransactions', () => {
    const saga = testSaga(dataBtcSagas.watchTransactions)
    const action = {}

    it('should fetch tx', () => {
      saga.next()
        .take(AT.FETCH_BITCOIN_TRANSACTIONS)
    })

    it('should call fetchTransactions', () => {
      saga.next(action)
        .call(dataBtcSagas.fetchTransactions, action)
    })

    // Try again
    it('should fetch tx', () => {
      saga.next()
        .take(AT.FETCH_BITCOIN_TRANSACTIONS)
    })

    it('should call fetchTransactions', () => {
      saga.next(action)
        .call(dataBtcSagas.fetchTransactions, action).finish().next().isDone()
    })
  })

  describe('fetchTransactions', () => {
    const saga = testSaga(dataBtcSagas.fetchTransactions)
    const action = {}
    const pages = [{  }]

    it('should get transactions', () => {
      saga.next()
        .select(S.getTransactions)
        .next()
    })
  })
})














