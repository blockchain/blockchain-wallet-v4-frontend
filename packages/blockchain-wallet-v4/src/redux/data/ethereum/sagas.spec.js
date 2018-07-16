import { select } from 'redux-saga/effects'
import { path, append, sum, values, length } from 'ramda'
import * as A from './actions'
import * as AT from './actionTypes'
import * as S from './selectors'
import * as selectors from '../../selectors'
import * as kvStoreSelectors from '../../kvStore/ethereum/selectors'

import { Remote } from 'blockchain-wallet-v4/src'
import { expectSaga, testSaga } from 'redux-saga-test-plan'
import sagas from './sagas'
import reducers from '../reducers'
import { convertFeeToWei } from '../../../utils/ethereum'

const ethereumFetchData = {
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
const ethereumTransactionData = {
  'xpub6BvQUYyon9wcJUgBUjhQ7E5iSSHVzsraSqmqiRLKUXoXE4PkFZ2h8x': {
    txns: [
      {
        hash: 'af09dh102pjASDFj09j2',
        to: 'asdf09j31029j21',
        from: '2912089hf0hf2109h120pd09'
      }
    ]
  }
}
const transactionHistory = { address: 'asdflkjsadfje', sent: {}, received: {} }
const ethereumEmptyTransactionData = {
  'xpub6BvQUYyon9wcJUgBUjhQ7E5iSSHVzsraSqmqiRLKUXoXE4PkFZ2h8x': {}
}
const rateData = { rate: 5213 }
const latest_block = { hash: 1234 }

const api = {
  getEthereumData: jest.fn(() => ethereumFetchData),
  getEthereumFee: jest.fn(() => feeData),
  getEthereumLatestBlock: jest.fn(() => latest_block),
  getEthereumTicker: jest.fn(() => rateData),
  getEthereumTransactions: jest.fn(() => ethereumTransactionData),
  getTransactionHistory: jest.fn(() => transactionHistory)
}

describe('ethereum data sagas', () => {
  const dataEthereumSagas = sagas({ api })

  describe('fetchData', () => {
    const mockContext = Remote.of('xpub6BvQUYyon9wcJUgBUjhQ7E5iSSHVzsraSqmqiRLKUXoXE4PkFZ2h8x')

    const ethereumData = {
      addresses: ethereumFetchData,
      info: {
        n_tx: sum(values(ethereumFetchData).map(obj => obj.txn_count)),
        total_received: sum(values(ethereumFetchData).map(obj => obj.totalReceived)),
        total_sent: sum(values(ethereumFetchData).map(obj => obj.totalSent)),
        final_balance: sum(values(ethereumFetchData).map(obj => obj.balance))
      },
      latest_block: latest_block
    }

    const saga = testSaga(dataEthereumSagas.fetchData)

    it('should put loading state', () => {
      saga.next().put(A.fetchDataLoading())
    })

    it('should select wallet', () => {
      saga.next().select(kvStoreSelectors.getContext)
    })

    it('should get data from api', () => {
      saga.next(mockContext).call(api.getEthereumData, mockContext.getOrFail())
    })

    it('should retrieve latest_block info', () => {
      saga.next(ethereumFetchData).call(api.getEthereumLatestBlock)
    })

    it('should dispatch success action', () => {
      saga
        .next(latest_block)
        .put(A.fetchDataSuccess(ethereumData))
        .next()
        .isDone()
    })

    it('should handle errors', () => {
      const error = { message: 'asdf' }

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
          .provide([
            [select(kvStoreSelectors.getContext), mockContext]
          ])
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
      const error = { message: 'asdf' }

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
      const error = { message: 'asdf' }

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
    const mockContextR = Remote.of('xpub6BvQUYyon9wcJUgBUjhQ7E5iSSHVzsraSqmqiRLKUXoXE4PkFZ2h8x')
    const mockContext = mockContextR.getOrFail()
    const payload = { reset: true }
    const saga = testSaga(dataEthereumSagas.fetchTransactions, { payload })
    const page = Remote.of([
      { hash: '93j0j32jadsfoiejwrpok' },
      { hash: '3ija09sfj029j29012j' },
      { hash: 'asdf092j0391jflkajsdf' }
    ])
    const pages = [page]
    const isNil = 'isNil'

    it('should get ethereum context', () => {
      saga.next().select(selectors.kvStore.ethereum.getContext)
    })

    it('should get pages', () => {
      saga.next(mockContextR).select(S.getTransactions)
    })

    it('should put loading state', () => {
      saga.next(pages).put(A.fetchTransactionsLoading(payload.reset))
    })

    it('should call getEthereumTransactions', () => {
      saga.next(mockContextR).call(api.getEthereumTransactions, mockContext, 0)
      saga.save(isNil)
    })

    it('should dispatch success with data', () => {
      saga.next(ethereumTransactionData).put(A.fetchTransactionsSuccess(path([mockContext, 'txns'], ethereumTransactionData), payload.reset))
    })

    it('should finish', () => {
      saga.next().isDone()
    })

    it('should fetch with length of pages if reset is false', () => {
      const saga = testSaga(dataEthereumSagas.fetchTransactions, { payload: { reset: false } })
      saga.next().select(selectors.kvStore.ethereum.getContext)
      saga.next(mockContextR).select(S.getTransactions)
      saga.next(pages).put(A.fetchTransactionsLoading(false))
      saga.next(mockContextR).call(api.getEthereumTransactions, mockContext, length(pages))
    })

    it('should not dispatch success if no txns', () => {
      saga.restore(isNil)
      saga.next(ethereumEmptyTransactionData)
        .isDone()
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
          payload: { address: '9120je02j1akslfdj', reset: true }
        })
          .withReducer(reducers)
          .provide([
            [select(selectors.kvStore.ethereum.getContext), mockContextR],
            [select(S.getTransactions), pages]
          ])
          .run()
          .then(result => {
            expect(result.storeState.ethereum).toMatchObject({
              transactions: [Remote.Success(path([mockContext, 'txns'], ethereumTransactionData))]
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
              transactions: append(Remote.Success(path([mockContext, 'txns'], ethereumTransactionData)), [
                Remote.Success(initTx)
              ])
            })
          })
      })
    })
  })
})
