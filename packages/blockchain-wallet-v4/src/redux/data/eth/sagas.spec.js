import * as A from './actions'
import * as AT from './actionTypes'
import * as S from './selectors'
import { Remote } from 'blockchain-wallet-v4/src'
import { testSaga } from 'redux-saga-test-plan'

import sagas from './sagas'

const ethFetchData = {
  '0x8790143B84A1A12ADA4aF057D7096A937143a476': {
    balance: 5,
    totalReceived: 100,
    totalSent: 95,
    txn_count: 7
  }
}
const feeData = {
  gasLimit: 5,
  priority: 6,
  regular: 5,
  limits: {
    min: 3,
    max: 20
  }
}
const ethTransactionData = {
  '0x4e7943357bbd52afd8d317fa7974abf8bb64beffe906bb4ab4d42e7ef5ac6af1': {
    txns: [
      {
        hash:
          '0x4e7943357bbd52afd8d317fa7974abf8bb64beffe906bb4ab4d42e7ef5ac6af1',
        to: '0xa881eb99eF00d25E3D971371CE595edC42ddeb41',
        from: '0x7a192bBb50c7a23E0EE37cD1D39A504Eb1662127'
      }
    ]
  }
}
const transactionHistory = {
  address: '0x7a192bBb50c7a23E0EE37cD1D39A504Eb1662127',
  sent: {},
  received: {}
}
const rateData = { rate: 13 }
const latest_block = {
  hash: '0x4e7943357bbd52afd8d317fa7974abf8bb64beffe906bb4ab4d42e7ef5ac6af1'
}

const api = {
  getEthData: jest.fn(() => ethFetchData),
  getEthFees: jest.fn(() => feeData),
  getEthLatestBlock: jest.fn(() => latest_block),
  getEthTicker: jest.fn(() => rateData),
  getEthTransactions: jest.fn(() => ethTransactionData),
  getTransactionHistory: jest.fn(() => transactionHistory)
}

describe('eth data sagas', () => {
  const dataEthSagas = sagas({ api })

  describe('fetchData', () => {
    const mockContext = Remote.of(
      '0x4e7943357bbd52afd8d317fa7974abf8bb64beffe906bb4ab4d42e7ef5ac6af1'
    )

    const saga = testSaga(dataEthSagas.fetchData)

    it('should put loading state', () => {
      saga.next().put(A.fetchDataLoading())
    })

    it('should select wallet', () => {
      saga.next().select(S.getContext)
    })

    it('should get data from api', () => {
      saga
        .next(mockContext.getOrFail())
        .call(api.getEthData, mockContext.getOrFail())
    })

    it('should retrieve latest_block info and end', () => {
      saga.next(ethFetchData).call(api.getEthLatestBlock)
    })

    it('should check for low eth balance and end', () => {
      saga
        .next()
        .next()
        .call(dataEthSagas.checkForLowEthBalance)
        .next()
        .isDone()
    })

    it('should handle errors', () => {
      const error = { message: 'failed to fetch data' }

      saga
        .restart()
        .next()
        .throw(error)
        .put(A.fetchDataFailure(error.message))
        .next()
        .isDone()
    })
  })

  describe('fetchRates', () => {
    const saga = testSaga(dataEthSagas.fetchRates)

    it('should put loading state', () => {
      saga.next().put(A.fetchRatesLoading())
    })

    it('should retrieve rates data', () => {
      saga.next().call(api.getEthTicker)
    })

    it('should dispatch success with data', () => {
      saga.next(rateData).put(A.fetchRatesSuccess(rateData))
    })

    it('should finish', () => {
      saga.next().isDone()
    })

    it('should handle errors', () => {
      const error = { message: 'failed to fetch rates' }

      saga
        .restart()
        .next()
        .throw(error)
        .put(A.fetchRatesFailure(error.message))
        .next()
        .isDone()
    })
  })

  describe('watchTransactions', () => {
    const saga = testSaga(dataEthSagas.watchTransactions)
    const action = {}

    it('should fetch tx', () => {
      saga.next().take(AT.FETCH_ETH_TRANSACTIONS)
    })

    it('should call fetchTransactions', () => {
      saga.next(action).call(dataEthSagas.fetchTransactions, action)
    })

    // Try again
    it('should fetch tx again', () => {
      saga.next().take(AT.FETCH_ETH_TRANSACTIONS)
    })

    it('should call fetchTransactions again', () => {
      saga.next(action).call(dataEthSagas.fetchTransactions, action)
    })
  })
})
