import { select } from 'redux-saga/effects'
import { path, append, sum, values, length } from 'ramda'
import * as A from './actions'
import * as AT from './actionTypes'
import * as S from './selectors'
import * as selectors from '../../selectors'

import { Remote } from 'blockchain-wallet-v4/src'
import { expectSaga, testSaga } from 'redux-saga-test-plan'
import sagas from './sagas'
import reducers from '../reducers'
import { convertFeeToWei } from '../../../utils/eth'

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
const ethereumEmptyTransactionData = {
  '0x4e7943357bbd52afd8d317fa7974abf8bb64beffe906bb4ab4d42e7ef5ac6af1': {}
}
const rateData = { rate: 13 }
const latest_block = {
  hash: '0x4e7943357bbd52afd8d317fa7974abf8bb64beffe906bb4ab4d42e7ef5ac6af1'
}

const api = {
  getEthereumData: jest.fn(() => ethFetchData),
  getEthereumFee: jest.fn(() => feeData),
  getEthereumLatestBlock: jest.fn(() => latest_block),
  getEthereumTicker: jest.fn(() => rateData),
  getEthereumTransactions: jest.fn(() => ethTransactionData),
  getTransactionHistory: jest.fn(() => transactionHistory)
}

describe('ethereum data sagas', () => {
  const dataEthereumSagas = sagas({ api })

  describe('fetchData', () => {
    const mockContext = Remote.of(
      '0x4e7943357bbd52afd8d317fa7974abf8bb64beffe906bb4ab4d42e7ef5ac6af1'
    )

    const ethereumData = {
      addresses: ethFetchData,
      info: {
        n_tx: sum(values(ethFetchData).map(obj => obj.txn_count)),
        total_received: sum(values(ethFetchData).map(obj => obj.totalReceived)),
        total_sent: sum(values(ethFetchData).map(obj => obj.totalSent)),
        final_balance: sum(values(ethFetchData).map(obj => obj.balance))
      },
      latest_block: latest_block
    }

    const saga = testSaga(dataEthereumSagas.fetchData)

    it('should put loading state', () => {
      saga.next().put(A.fetchDataLoading())
    })

    it('should select wallet', () => {
      saga.next().select(S.getContext)
    })

    it('should get data from api', () => {
      saga
        .next(mockContext.getOrFail())
        .call(api.getEthereumData, mockContext.getOrFail())
    })

    it('should retrieve latest_block info', () => {
      saga.next(ethFetchData).call(api.getEthereumLatestBlock)
    })

    it('should dispatch success action', () => {
      saga
        .next(latest_block)
        .put(A.fetchDataSuccess(ethereumData))
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
      it('should add ethereum data to the state', () => {
        return expectSaga(dataEthereumSagas.fetchData)
          .withReducer(reducers)
          .provide([[select(S.getContext), mockContext]])
          .run()
          .then(result => {
            expect(result.storeState.ethereum).toMatchObject({
              addresses: Remote.Success(ethereumData.addresses),
              info: Remote.Success(ethereumData.info),
              latest_block: Remote.Success(ethereumData.latest_block)
            })
          })
      })
    })
  })

  describe('fetchFee', () => {
    const saga = testSaga(dataEthereumSagas.fetchFee)
    const weiData = convertFeeToWei(feeData)

    it('should put loading state', () => {
      saga.next().put(A.fetchFeeLoading())
    })

    it('should retrieve fee data', () => {
      saga.next().call(api.getEthereumFee)
    })

    it('should dispatch success with data', () => {
      saga
        .next(feeData)
        .put(A.fetchFeeSuccess(weiData))
        .next()
        .isDone()
    })

    it('should handle errors', () => {
      const error = { message: 'failed to fetch fee' }

      saga
        .restart()
        .next()
        .throw(error)
        .put(A.fetchFeeFailure(error.message))
        .next()
        .isDone()
    })

    describe('state change', () => {
      it('should add fee data to the state', () => {
        return expectSaga(dataEthereumSagas.fetchFee)
          .withReducer(reducers)
          .run()
          .then(result => {
            expect(result.storeState.ethereum).toMatchObject({
              fee: Remote.Success(weiData)
            })
          })
      })
    })
  })

  describe('fetchRates', () => {
    const saga = testSaga(dataEthereumSagas.fetchRates)

    it('should put loading state', () => {
      saga.next().put(A.fetchRatesLoading())
    })

    it('should retrieve rates data', () => {
      saga.next().call(api.getEthereumTicker)
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

    describe('state change', () => {
      it('should add rate data to the state', () => {
        return expectSaga(dataEthereumSagas.fetchRates)
          .withReducer(reducers)
          .run()
          .then(result => {
            expect(result.storeState.ethereum).toMatchObject({
              rates: Remote.Success(rateData)
            })
          })
      })
    })
  })

  describe('watchTransactions', () => {
    const saga = testSaga(dataEthereumSagas.watchTransactions)
    const action = {}

    it('should fetch tx', () => {
      saga.next().take(AT.FETCH_ETHEREUM_TRANSACTIONS)
    })

    it('should call fetchTransactions', () => {
      saga.next(action).call(dataEthereumSagas.fetchTransactions, action)
    })

    // Try again
    it('should fetch tx again', () => {
      saga.next().take(AT.FETCH_ETHEREUM_TRANSACTIONS)
    })

    it('should call fetchTransactions again', () => {
      saga.next(action).call(dataEthereumSagas.fetchTransactions, action)
    })
  })

  describe('fetchTransactions', () => {
    const mockContextR = Remote.of(
      '0x4e7943357bbd52afd8d317fa7974abf8bb64beffe906bb4ab4d42e7ef5ac6af1'
    )
    const mockContext = mockContextR.getOrFail()
    const payload = { reset: true }
    const saga = testSaga(dataEthereumSagas.fetchTransactions, { payload })
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

    it('should get ethereum context', () => {
      saga.next().select(selectors.kvStore.ethereum.getContext)
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

    it('should call getEthereumTransactions', () => {
      saga.next(mockContextR).call(api.getEthereumTransactions, mockContext, 0)
      saga.save(isNil)
    })

    it('should set transactionsAtBound', () => {
      saga.next(ethTransactionData).put(A.transactionsAtBound(true))
    })

    it('should dispatch success with data', () => {
      saga
        .next(ethTransactionData)
        .put(
          A.fetchTransactionsSuccess(
            path([mockContext, 'txns'], ethTransactionData),
            payload.reset
          )
        )
    })

    it('should finish', () => {
      saga.next().isDone()
    })

    it('should fetch with length of pages if reset is false', () => {
      const saga = testSaga(dataEthereumSagas.fetchTransactions, {
        payload: { reset: false }
      })
      saga.next().select(selectors.kvStore.ethereum.getContext)
      saga.next(mockContextR).select(S.getTransactions)
      saga.next(pages).select(S.getTransactionsAtBound)
      saga.next(false).put(A.fetchTransactionsLoading(false))
      saga
        .next(mockContextR)
        .call(api.getEthereumTransactions, mockContext, length(pages))
    })

    it('should not dispatch success if no txns', () => {
      saga.restore(isNil)
      saga.next(ethereumEmptyTransactionData).isDone()
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

    describe('state change', () => {
      it('should add transaction data to the state', () => {
        return expectSaga(dataEthereumSagas.fetchTransactions, {
          payload: {
            reset: true
          }
        })
          .withReducer(reducers)
          .provide([
            [select(selectors.kvStore.ethereum.getContext), mockContextR],
            [select(S.getTransactions), pages]
          ])
          .run()
          .then(result => {
            expect(result.storeState.ethereum).toMatchObject({
              transactions: [
                Remote.Success(path([mockContext, 'txns'], ethTransactionData))
              ]
            })
          })
      })

      it('should append transaction data to the state if reset is false', () => {
        const initTx = [Remote.Success({ id: 2 }), Remote.Success({ id: 3 })]
        return expectSaga(dataEthereumSagas.fetchTransactions, {
          payload: { reset: false }
        })
          .withReducer(reducers)
          .withState({
            ethereum: {
              transactions: [Remote.Success(initTx)]
            }
          })
          .provide([
            [select(selectors.kvStore.ethereum.getContext), mockContextR],
            [select(S.getTransactions), pages]
          ])
          .run()
          .then(result => {
            expect(result.storeState.ethereum).toMatchObject({
              transactions: append(
                Remote.Success(path([mockContext, 'txns'], ethTransactionData)),
                [Remote.Success(initTx)]
              )
            })
          })
      })
    })
  })
})
