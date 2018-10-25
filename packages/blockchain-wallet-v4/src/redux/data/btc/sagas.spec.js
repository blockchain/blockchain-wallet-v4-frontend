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

const btcFetchData = {
  addresses: [
    {
      address: '1HtmX6EasEE91ymDguhZ2pF9mSgEPbxxpH'
    }
  ],
  wallet: {},
  info: {
    latest_block: {}
  },
  txs: [
    {
      id: 1
    }
  ]
}
const transactionHistory = {
  address: '1HtmX6EasEE91ymDguhZ2pF9mSgEPbxxpH',
  sent: {},
  received: {}
}
const feeData = { fee: 1239 }
const rateData = { rate: 5213 }
const fiatAtTime = { value: 33 }

const api = {
  fetchBlockchainData: jest.fn(() => btcFetchData),
  getBitcoinFee: jest.fn(() => feeData),
  getBitcoinFiatAtTime: jest.fn(() => fiatAtTime),
  getBitcoinTicker: jest.fn(() => rateData),
  getTransactionHistory: jest.fn(() => transactionHistory)
}

describe('bitcoin data sagas', () => {
  const dataBtcSagas = sagas({ api })

  describe('fetchData', () => {
    const mockContext = '1HtmX6EasEE91ymDguhZ2pF9mSgEPbxxpH'
    const btcData = {
      addresses: indexBy(prop('address'), prop('addresses', btcFetchData)),
      info: path(['wallet'], btcFetchData),
      latest_block: path(['info', 'latest_block'], btcFetchData)
    }

    const saga = testSaga(dataBtcSagas.fetchData)

    it('should put loading state', () => {
      saga.next().put(A.fetchDataLoading())
    })

    it('should select wallet', () => {
      saga.next().select(S.getContext)
    })

    it('should get data from api', () => {
      saga
        .next(mockContext)
        .call(api.fetchBlockchainData, mockContext, { n: 1 })
    })

    it('should dispatch success action', () => {
      saga
        .next(btcFetchData)
        .put(A.fetchDataSuccess(btcData))
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
      it('should add bitcoin data to the state', () => {
        return expectSaga(dataBtcSagas.fetchData)
          .withReducer(reducers)
          .provide([[select(S.getContext), mockContext]])
          .run()
          .then(result => {
            expect(result.storeState.bitcoin).toMatchObject({
              addresses: Remote.Success(
                indexBy(prop('address'), prop('addresses', btcFetchData))
              ),
              info: Remote.Success(btcFetchData.wallet),
              latest_block: Remote.Success(btcFetchData.info.latest_block)
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
      saga
        .next(feeData)
        .put(A.fetchFeeSuccess(feeData))
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
        return expectSaga(dataBtcSagas.fetchFee)
          .withReducer(reducers)
          .run()
          .then(result => {
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
        return expectSaga(dataBtcSagas.fetchRates)
          .withReducer(reducers)
          .run()
          .then(result => {
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
      saga.next().take(AT.FETCH_BITCOIN_TRANSACTIONS)
    })

    it('should call fetchTransactions', () => {
      saga.next(action).call(dataBtcSagas.fetchTransactions, action)
    })

    // Try again
    it('should fetch tx again', () => {
      saga.next().take(AT.FETCH_BITCOIN_TRANSACTIONS)
    })

    it('should call fetchTransactions again', () => {
      saga.next(action).call(dataBtcSagas.fetchTransactions, action)
    })
  })

  describe('fetchTransactions', () => {
    const mockContext = '1HtmX6EasEE91ymDguhZ2pF9mSgEPbxxpH'
    const payload = { address: 'address', reset: false }
    const saga = testSaga(dataBtcSagas.fetchTransactions, { payload })
    const page = Remote.of([{ id: 1 }, { id: 2 }, { id: 3 }])
    const blankPage = Remote.of([])
    const pages = [page]
    const conditional = 'conditional'

    it('should get transactions', () => {
      saga.next().select(S.getTransactions)

      saga.save(conditional)
    })

    it('should select transactionsAtBound state', () => {
      saga.next(pages).select(S.getTransactionsAtBound)
    })

    it('should put loading state', () => {
      saga.next(false).put(A.fetchTransactionsLoading(payload.reset))
    })

    it('should select wallet context', () => {
      saga.next().select(selectors.wallet.getWalletContext)
    })

    it('should select full context', () => {
      saga.next(mockContext).select(S.getContext)
    })

    it('should call fetchBlockchainData', () => {
      saga.next(mockContext).call(api.fetchBlockchainData, mockContext, {
        n: 10,
        onlyShow: payload.address,
        offset: 10
      })
    })

    it('should set transactionsAtBound', () => {
      saga.next(btcFetchData).put(A.transactionsAtBound(true))
    })

    it('should dispatch success with data', () => {
      saga
        .next(btcFetchData)
        .put(A.fetchTransactionsSuccess(btcFetchData.txs, payload.reset))
    })

    it('should finish', () => {
      saga.next().isDone()
    })

    it('should break if reset is false and no last page', () => {
      saga.restore(conditional)
      saga
        .next([blankPage])
        .next(true)
        .isDone()
    })

    it('should handle errors', () => {
      const error = { message: 'failed to fetch txs' }

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
        return expectSaga(dataBtcSagas.fetchTransactions, {
          payload: {
            address: '1HtmX6EasEE91ymDguhZ2pF9mSgEPbxxpH',
            reset: true
          }
        })
          .withReducer(reducers)
          .provide([
            [select(selectors.wallet.getWalletContext), mockContext],
            [select(S.getContext), mockContext],
            [select(S.getTransactions), pages]
          ])
          .run()
          .then(result => {
            expect(result.storeState.bitcoin).toMatchObject({
              transactions: [Remote.Success(btcFetchData.txs)]
            })
          })
      })

      it('should append transaction data to the state if reset is false', () => {
        const initTx = [Remote.Success({ id: 2 }), Remote.Success({ id: 3 })]
        return expectSaga(dataBtcSagas.fetchTransactions, {
          payload: {
            address: '1HtmX6EasEE91ymDguhZ2pF9mSgEPbxxpH',
            reset: false
          }
        })
          .withReducer(reducers)
          .withState({
            bitcoin: {
              transactions: [Remote.Success(initTx)]
            }
          })
          .provide([
            [select(selectors.wallet.getWalletContext), mockContext],
            [select(S.getContext), mockContext],
            [select(S.getTransactions), pages]
          ])
          .run()
          .then(result => {
            expect(result.storeState.bitcoin).toMatchObject({
              transactions: append(Remote.Success(btcFetchData.txs), [
                Remote.Success(initTx)
              ])
            })
          })
      })
    })
  })

  describe('fetchTransactionHistory', () => {
    const payload = {
      address: '1HtmX6EasEE91ymDguhZ2pF9mSgEPbxxpH',
      start: '01/01/2018',
      end: '01/06/2018'
    }
    const saga = testSaga(dataBtcSagas.fetchTransactionHistory, { payload })
    const currency = Remote.of('EUR')
    const beforeGettingHistory = 'beforeGettingHistory'

    it('should put loading state', () => {
      saga.next().put(A.fetchTransactionHistoryLoading())
    })

    it('should get currency', () => {
      saga.next().select(selectors.settings.getCurrency)
    })

    it('should get transaction data with address if possible', () => {
      saga.save(beforeGettingHistory)
      saga
        .next(currency)
        .call(
          api.getTransactionHistory,
          'BTC',
          payload.address,
          currency.getOrElse('USD'),
          payload.start,
          payload.end
        )
    })

    it('should dispatch success with data', () => {
      saga
        .next(transactionHistory)
        .put(A.fetchTransactionHistorySuccess(transactionHistory))
    })

    const payloadNoAddr = { start: '01/01/2018', end: '01/06/2018' }
    const mockContext = [
      '1HtmX6EasEE91ymDguhZ2pF9mSgEPbxxpH',
      '1HtmX6EasEE91ymDguhZ2pF9mSgEPbxxpH'
    ]
    const active = mockContext.join('|')

    it('should get transaction data with context if no address present', () => {
      return expectSaga(dataBtcSagas.fetchTransactionHistory, {
        payload: payloadNoAddr
      })
        .provide([
          [select(selectors.settings.getCurrency), currency],
          [select(S.getContext), mockContext]
        ])
        .call(
          api.getTransactionHistory,
          'BTC',
          active,
          currency.getOrElse('USD'),
          payload.start,
          payload.end
        )
        .put(A.fetchTransactionHistorySuccess(transactionHistory))
        .run()
    })

    it('should handle errors', () => {
      const error = { message: 'asdf' }

      saga
        .restart()
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
          .provide([[select(selectors.settings.getCurrency), Remote.of('USD')]])
          .run()
          .then(result => {
            expect(result.storeState.bitcoin).toMatchObject({
              transaction_history: Remote.Success(transactionHistory)
            })
          })
      })

      it('should add transactionHistory data to the state using context if no address', () => {
        return expectSaga(dataBtcSagas.fetchTransactionHistory, {
          payload: payloadNoAddr
        })
          .withReducer(reducers)
          .provide([
            [select(selectors.settings.getCurrency), Remote.of('USD')],
            [select(S.getContext), mockContext]
          ])
          .run()
          .then(result => {
            expect(result.storeState.bitcoin).toMatchObject({
              transaction_history: Remote.Success(transactionHistory)
            })
          })
      })
    })
  })

  describe('fetchFiatAtTime', () => {
    const payload = {
      hash: '0000000000000000001cb1a74787df30ed2c44c72eacb517059b4f391c533577',
      amount: 1520,
      time: 1530895842000,
      currency: 'USD'
    }
    const saga = testSaga(dataBtcSagas.fetchFiatAtTime, { payload })
    const data = {}

    it('should put loading state', () => {
      saga.next().put(A.fetchFiatAtTimeLoading(payload.hash, payload.currency))
    })

    it('should call getBitcoinFiatAtTime', () => {
      saga
        .next()
        .call(
          api.getBitcoinFiatAtTime,
          payload.amount,
          payload.currency,
          payload.time
        )
    })

    it('should dispatch success with data', () => {
      saga
        .next(data)
        .put(A.fetchFiatAtTimeSuccess(payload.hash, payload.currency, data))
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
        .put(
          A.fetchFiatAtTimeFailure(
            payload.hash,
            payload.currency,
            error.message
          )
        )
        .next()
        .isDone()
    })

    describe('state change', () => {
      it('should add fiatAtTime data to the state', () => {
        return expectSaga(dataBtcSagas.fetchFiatAtTime, { payload })
          .withReducer(reducers)
          .run()
          .then(result => {
            expect(result.storeState.bitcoin).toMatchObject({
              transactions_fiat: assocPath(
                [payload.hash, payload.currency],
                Remote.Success(fiatAtTime),
                {}
              )
            })
          })
      })
    })
  })
})
