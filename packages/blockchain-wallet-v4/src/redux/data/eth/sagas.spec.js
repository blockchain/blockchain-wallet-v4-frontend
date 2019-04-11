import { select } from 'redux-saga/effects'
import { path, sum, values, length } from 'ramda'
import * as A from './actions'
import * as AT from './actionTypes'
import * as S from './selectors'
import * as selectors from '../../selectors'

import { Remote } from 'blockchain-wallet-v4/src'
import { expectSaga, testSaga } from 'redux-saga-test-plan'
import sagas from './sagas'
import reducers from '../reducers'

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
const ethEmptyTransactionData = {
  '0x4e7943357bbd52afd8d317fa7974abf8bb64beffe906bb4ab4d42e7ef5ac6af1': {}
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

    const ethInfo = {
      n_tx: sum(values(ethFetchData).map(obj => obj.txn_count)),
      total_received: sum(values(ethFetchData).map(obj => obj.totalReceived)),
      total_sent: sum(values(ethFetchData).map(obj => obj.totalSent)),
      final_balance: sum(values(ethFetchData).map(obj => obj.balance))
    }

    const ethData = {
      addresses: ethFetchData,
      info: ethInfo,
      latest_block: latest_block
    }

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
      saga
        .next(ethFetchData)
        .call(api.getEthLatestBlock)
        .next()
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

    describe('state change', () => {
      it('should add eth data to the state', () => {
        return expectSaga(dataEthSagas.fetchData)
          .withReducer(reducers)
          .provide([[select(S.getContext), mockContext]])
          .run()
          .then(result => {
            expect(result.storeState.eth).toMatchObject({
              addresses: Remote.Success(ethData.addresses),
              info: {
                eth: Remote.Success(ethData.info),
                pax: Remote.NotAsked
              },
              latest_block: Remote.Success(ethData.latest_block),
              current_balance: {
                eth: Remote.NotAsked,
                pax: Remote.NotAsked
              },
              fee: Remote.NotAsked,
              legacy_balance: Remote.NotAsked,
              rates: {
                eth: Remote.NotAsked,
                pax: Remote.NotAsked
              },
              transactions_at_bound: {
                eth: false,
                pax: false
              },
              transactions: {
                eth: [],
                pax: []
              }
            })
          })
      })
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

  describe('fetchTransactions', () => {
    const mockContextR = Remote.of(
      '0x4e7943357bbd52afd8d317fa7974abf8bb64beffe906bb4ab4d42e7ef5ac6af1'
    )
    const mockContext = mockContextR.getOrFail()
    const payload = { reset: true }
    const saga = testSaga(dataEthSagas.fetchTransactions, { payload })
    const page = Remote.of([
      {
        hash:
          '0x4e7943357bbd52afd8d317fa7974abf8bb64beffe906bb4ab4d42e7ef5ac6af1'
      },
      {
        hash:
          '0xe039b75f3e777deb659c86d50fe34e3e2b353d5f95b6b7b5930e18ae67da18d8'
      },
      {
        hash:
          '0x924d8d4e489fec37d6de4fa2a1528fbb7cf7e0a0af8a31434fe682073d3e988f'
      }
    ])
    const pages = [page]
    const isNil = 'isNil'
    const txs = path([mockContext, 'txns'], ethTransactionData)
    const processedTxs = dataEthSagas.__processTxs(txs)

    it('should get eth context', () => {
      saga.next().select(selectors.kvStore.eth.getContext)
    })

    it('should get pages', () => {
      saga.next(mockContextR).select(S.getTransactions)
    })

    it('should getTransactionsAtBound state', () => {
      saga.next(pages).select(S.getTransactionsAtBound)
    })

    it('should put loading state', () => {
      saga.next(false).put(A.fetchTransactionsLoading(payload.reset))
    })

    it('should call getEthTransactions', () => {
      saga.next(mockContextR).call(api.getEthTransactions, mockContext, 0)
      saga.save(isNil)
    })

    it('should set transactionsAtBound', () => {
      saga.next(ethTransactionData).put(A.transactionsAtBound(true))
    })

    it('should dispatch success with data', () => {
      saga
        .next(ethTransactionData)
        .call(dataEthSagas.__processTxs, txs)
        .next(processedTxs)
        .put(A.fetchTransactionsSuccess(processedTxs, payload.reset))
    })

    it('should finish', () => {
      saga.next().isDone()
    })

    it('should fetch with length of pages if reset is false', () => {
      const saga = testSaga(dataEthSagas.fetchTransactions, {
        payload: { reset: false }
      })
      saga.next().select(selectors.kvStore.eth.getContext)
      saga.next(mockContextR).select(S.getTransactions)
      saga.next(pages).select(S.getTransactionsAtBound)
      saga.next(false).put(A.fetchTransactionsLoading(false))
      saga
        .next(mockContextR)
        .call(api.getEthTransactions, mockContext, length(pages))
    })

    it('should not dispatch success if no txns', () => {
      saga.restore(isNil)
      saga.next(ethEmptyTransactionData).isDone()
    })

    it('should handle errors', () => {
      const error = { message: 'asdf' }

      saga
        .restart()
        .next()
        .throw(error)
        .put(A.fetchTransactionsFailure(error.message))
        .next()
        .isDone()
    })
  })
})
