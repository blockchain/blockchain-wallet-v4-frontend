import { select } from 'redux-saga/effects'
import { indexBy, path, prop, append, assocPath } from 'ramda'
import * as A from './actions'
import * as AT from './actionTypes'
import * as S from './selectors'
import * as selectors from '../../selectors'

import { Remote } from 'blockchain-wallet-v4/src'
import { expectSaga, testSaga } from 'redux-saga-test-plan'
import sagas from './sagas'
import reducers from '../reducers'

const blockchainData = {
  addresses: [{
    address: 'xpub6BvQUYyon9wcJUgBUjhQ7E5iSSHVzsraSqmqiRLKUXoXE4PkFZ2h8x7yuuXZdFeJSQgTX2o8n4kq4z32aGFkfkC6ZBrW9hJR1jDuEdA7uJa'
  }],
  wallet: {},
  info: {
    latest_block: {}
  },
  txs: [{
    id: 1
  }]
}
const transactionHistory = { address: 'asdflkjsadfje', sent: {}, received: {} }
const feeData = { fee: 1239 }
const rateData = { rate: 5213 }
const fiatAtTime = { value: 33 }

const api = {
  fetchBlockchainData: jest.fn(() => blockchainData),
  getBitcoinFee: jest.fn(() => feeData),
  getBitcoinFiatAtTime: jest.fn(() => fiatAtTime),
  getBitcoinTicker: jest.fn(() => rateData),
  getTransactionHistory: jest.fn(() => transactionHistory)
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

    describe('state change', () => {
      it('should add bitcoin data to the state', () => {
        return expectSaga(dataBtcSagas.fetchData)
          .withReducer(reducers)
          .provide([
            [select(selectors.wallet.getContext), mockContext]
          ])
          .run()
          .then((result) => {
            expect(result.storeState.bitcoin).toMatchObject({
              addresses: Remote.Success(indexBy(prop('address'), prop('addresses', blockchainData))),
              info: Remote.Success(blockchainData.wallet),
              latest_block: Remote.Success(blockchainData.info.latest_block)
            })
          })
      })
    })
  })

  describe('fetchFee', () => {
    const saga = testSaga(dataBtcSagas.fetchFee)

    it('should put loading state', () => {
      saga.next().put(A.fetchFeeLoading())
    })

    it('should retrieve fee data', () => {
      saga.next().call(api.getBitcoinFee)
    })

    it('should dispatch success with data', () => {
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

    describe('state change', () => {
      it('should add fee data to the state', () => {
        return expectSaga(dataBtcSagas.fetchFee)
          .withReducer(reducers)
          .run()
          .then((result) => {
            expect(result.storeState.bitcoin).toMatchObject({
              fee: Remote.Success(feeData)
            })
          })
      })
    })
  })

  describe('fetchRates', () => {
    const saga = testSaga(dataBtcSagas.fetchRates)

    it('should put loading state', () => {
      saga.next().put(A.fetchRatesLoading())
    })

    it('should retrieve rates data', () => {
      saga.next().call(api.getBitcoinTicker)
    })

    it('should dispatch success with data', () => {
      saga.next(rateData).put(A.fetchRatesSuccess(rateData))
    })

    it('should finish', () => {
      saga.next().isDone()
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

    describe('state change', () => {
      it('should add rate data to the state', () => {
        return expectSaga(dataBtcSagas.fetchRates)
          .withReducer(reducers)
          .run()
          .then((result) => {
            expect(result.storeState.bitcoin).toMatchObject({
              rates: Remote.Success(rateData)
            })
          })
      })
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
    it('should fetch tx again', () => {
      saga.next()
        .take(AT.FETCH_BITCOIN_TRANSACTIONS)
    })

    it('should call fetchTransactions again', () => {
      saga.next(action)
        .call(dataBtcSagas.fetchTransactions, action)
    })
  })

  describe('fetchTransactions', () => {
    const mockContext = 'xpub6BvQUYyon9wcJUgBUjhQ7E5iSSHVzsraSqmqiRLKUXoXE4PkFZ2h8x'
    const data = {
      addresses: [{
        address: 'xpub6BvQUYyon9wcJUgBUjhQ7E5iSSHVzsraSqmqiRLKUXoXE4PkFZ2h8x7yuuXZdFeJSQgTX2o8n4kq4z32aGFkfkC6ZBrW9hJR1jDuEdA7uJa'
      }],
      wallet: {},
      info: {
        latest_block: {}
      },
      txs: [{
        id: 1
      }]
    }
    const payload = { address: 'address', reset: false }
    const saga = testSaga(dataBtcSagas.fetchTransactions, { payload })
    const page = Remote.of([{ hash: '93j0j32jadsfoiejwrpok' }, { hash: '3ija09sfj029j29012j' }, { hash: 'asdf092j0391jflkajsdf' }])
    const blankPage = Remote.of([])
    const pages = [page]
    const conditional = 'conditional'

    it('should get transactions', () => {
      saga.next()
        .select(S.getTransactions)

      saga.save(conditional)
    })

    it('should put loading state', () => {
      saga.next(pages)
        .put(A.fetchTransactionsLoading(payload.reset))
    })

    it('should select context', () => {
      saga.next()
        .select(selectors.wallet.getWalletContext)
    })

    it('should call fetchBlockchainData', () => {
      saga.next(mockContext)
        .call(api.fetchBlockchainData, mockContext, { n: 10, onlyShow: payload.address, offset: 10 })
    })

    it('should dispatch success with data', () => {
      saga.next(data).put(A.fetchTransactionsSuccess(data.txs, payload.reset))
    })

    it('should finish', () => {
      saga.next().isDone()
    })

    it('should break if reset is false and no last page', () => {
      saga.restore(conditional)
      saga.next([blankPage])
        .next()
        .isDone()
    })

    it('should handle errors', () => {
      const error = { message: 'asdf' }

      saga.restart()
        .next()
        .throw(error)
        .put(A.fetchTransactionsFailure(error.message))
        .next()
        .isDone()
    })

    describe('state change', () => {
      it('should add transaction data to the state', () => {
        return expectSaga(dataBtcSagas.fetchTransactions, { payload: { address: '9120je02j1akslfdj', reset: true } })
          .withReducer(reducers)
          .provide([
            [select(selectors.wallet.getWalletContext), mockContext],
            [select(S.getTransactions), pages]
          ])
          .run()
          .then((result) => {
            expect(result.storeState.bitcoin).toMatchObject({
              transactions: [Remote.Success(blockchainData.txs)]
            })
          })
      })

      it('should append transaction data to the state if reset is false', () => {
        const initTx = [Remote.Success({id: 2}), Remote.Success({id: 3})]
        return expectSaga(dataBtcSagas.fetchTransactions, { payload: { address: '9120je02j1akslfdj', reset: false } })
          .withReducer(reducers)
          .withState({
            bitcoin: {
              transactions: [Remote.Success(initTx)]
            }
          })
          .provide([
            [select(selectors.wallet.getWalletContext), mockContext],
            [select(S.getTransactions), pages]
          ])
          .run()
          .then((result) => {
            expect(result.storeState.bitcoin).toMatchObject({
              transactions: append(Remote.Success(blockchainData.txs), [Remote.Success(initTx)])
            })
          })
      })
    })
  })

  describe('fetchTransactionHistory', () => {
    const payload = { address: 'asdf912j039j12', start: '01/01/2018', end: '01/06/2018' }
    const saga = testSaga(dataBtcSagas.fetchTransactionHistory, { payload })
    const currency = Remote.of('EUR')
    const beforeGettingHistory = 'beforeGettingHistory'

    it('should put loading state', () => {
      saga.next()
        .put(A.fetchTransactionHistoryLoading())
    })

    it('should get currency', () => {
      saga.next()
        .select(selectors.settings.getCurrency)
    })

    it('should get transaction data with address if possible', () => {
      saga.save(beforeGettingHistory)
      saga.next(currency)
        .call(api.getTransactionHistory, 'BTC', payload.address, currency.getOrElse('USD'), payload.start, payload.end)
    })

    it('should dispatch success with data', () => {
      saga.next(transactionHistory)
        .put(A.fetchTransactionHistorySuccess(transactionHistory))
    })

    const payloadNoAddr = { start: '01/01/2018', end: '01/06/2018' }
    const mockContext = ['xpub6BvQUYyon9wcJUgBUjhQ7E5iSSHVzsraSqmqiRLKUXoXE4PkFZ2h8x', 'xpub6BvQUYyokJ9j301jd09slQEWhlk21j3JKlwLKUXoXE4PkFZ2h8x']
    const active = mockContext.join('|')

    it('should get transaction data with context if no address present', () => {
      return expectSaga(dataBtcSagas.fetchTransactionHistory, { payload: payloadNoAddr })
        .provide([
          [select(selectors.settings.getCurrency), currency],
          [select(selectors.wallet.getWalletContext), mockContext]
        ])
        .call(api.getTransactionHistory, 'BTC', active, currency.getOrElse('USD'), payload.start, payload.end)
        .put(A.fetchTransactionHistorySuccess(transactionHistory))
        .run()
    })

    it('should handle errors', () => {
      const error = { message: 'asdf' }

      saga.restart()
        .next()
        .throw(error)
        .put(A.fetchTransactionHistoryFailure(error.message))
        .next()
        .isDone()
    })

    describe('state change', () => {
      it('should add transactionHistory data to the state', () => {
        return expectSaga(dataBtcSagas.fetchTransactionHistory, { payload })
          .withReducer(reducers)
          .provide([
            [select(selectors.settings.getCurrency), Remote.of('USD')]
          ])
          .run()
          .then((result) => {
            expect(result.storeState.bitcoin).toMatchObject({
              transaction_history: Remote.Success(transactionHistory)
            })
          })
      })

      it('should add transactionHistory data to the state using context if no address', () => {
        return expectSaga(dataBtcSagas.fetchTransactionHistory, { payload: payloadNoAddr })
          .withReducer(reducers)
          .provide([
            [select(selectors.settings.getCurrency), Remote.of('USD')],
            [select(selectors.wallet.getWalletContext), mockContext]
          ])
          .run()
          .then((result) => {
            expect(result.storeState.bitcoin).toMatchObject({
              transaction_history: Remote.Success(transactionHistory)
            })
          })
      })
    })
  })

  describe('fetchFiatAtTime', () => {
    const payload = { hash: '11c324799f14344331c2fde1aac6a35ddd5d0a0a5db417109687e37ae40f1c13', amount: 1520, time: 1530895842000, currency: 'USD' }
    const saga = testSaga(dataBtcSagas.fetchFiatAtTime, { payload })
    const data = {}

    it('should put loading state', () => {
      saga.next()
        .put(A.fetchFiatAtTimeLoading(payload.hash, payload.currency))
    })

    it('should call getBitcoinFiatAtTime', () => {
      saga.next()
        .call(api.getBitcoinFiatAtTime, payload.amount, payload.currency, payload.time)
    })

    it('should dispatch success with data', () => {
      saga.next(data)
        .put(A.fetchFiatAtTimeSuccess(payload.hash, payload.currency, data))
    })

    it('should finish', () => {
      saga.next().isDone()
    })

    it('should handle errors', () => {
      const error = { message: 'asdf' }

      saga.restart()
        .next()
        .throw(error)
        .put(A.fetchFiatAtTimeFailure(payload.hash, payload.currency, error.message))
        .next()
        .isDone()
    })

    describe('state change', () => {
      it('should add fiatAtTime data to the state', () => {
        return expectSaga(dataBtcSagas.fetchFiatAtTime, { payload })
          .withReducer(reducers)
          .run()
          .then((result) => {
            expect(result.storeState.bitcoin).toMatchObject({
              transactions_fiat: assocPath([payload.hash, payload.currency], Remote.Success(fiatAtTime), {})
            })
          })
      })
    })
  })
})
