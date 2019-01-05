import { select } from 'redux-saga/effects'
import { indexBy, path, prop, append } from 'ramda'
import * as A from './actions'
import * as AT from './actionTypes'
import * as S from './selectors'
import * as selectors from '../../selectors'
import { fromCashAddr } from '../../../utils/bch'

import { Remote } from 'blockchain-wallet-v4/src'
import { expectSaga, testSaga } from 'redux-saga-test-plan'
import sagas from './sagas'
import reducers from '../reducers'

const CASH_ADDR_ADDRESS = 'qq07l6rr5lsdm3m80qxw80ku2ex0tj76vvsxpvmgme'

const bchFetchData = {
  addresses: [
    {
      address: 'qryjvc08ml7ep6dvexffrcuy9g9zz084jcgltg35xs'
    }
  ],
  wallet: {},
  info: {
    latest_block: {}
  },
  txs: [
    {
      id: 1,
      time: 1601590000
    }
  ]
}
const transactionHistory = {
  address: 'qryjvc08ml7ep6dvexffrcuy9g9zz084jcgltg35xs',
  sent: {},
  received: {}
}
const feeData = { fee: 1239 }
const rateData = { rate: 5213 }
const fiatAtTime = { value: 33 }

const api = {
  fetchBchData: jest.fn(() => bchFetchData),
  getBchFee: jest.fn(() => feeData),
  getBchFiatAtTime: jest.fn(() => fiatAtTime),
  getBchTicker: jest.fn(() => rateData),
  getTransactionHistory: jest.fn(() => transactionHistory)
}

describe('bch data sagas', () => {
  const dataBchSagas = sagas({ api })

  describe('fetchData', () => {
    const mockContext = 'qryjvc08ml7ep6dvexffrcuy9g9zz084jcgltg35xs'
    const bchData = {
      addresses: indexBy(prop('address'), prop('addresses', bchFetchData)),
      info: path(['wallet'], bchFetchData),
      latest_block: path(['info', 'latest_block'], bchFetchData)
    }

    const saga = testSaga(dataBchSagas.fetchData)

    it('should put loading state', () => {
      saga.next().put(A.fetchDataLoading())
    })

    it('should select wallet', () => {
      saga.next().select(S.getContext)
    })

    it('should get data from api', () => {
      saga.next(mockContext).call(api.fetchBchData, mockContext, { n: 1 })
    })

    it('should dispatch success action', () => {
      saga
        .next(bchFetchData)
        .put(A.fetchDataSuccess(bchData))
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
      it('should add bch data to the state', () => {
        return expectSaga(dataBchSagas.fetchData)
          .withReducer(reducers)
          .provide([[select(S.getContext), mockContext]])
          .run()
          .then(result => {
            expect(result.storeState.bch).toMatchObject({
              addresses: Remote.Success(
                indexBy(prop('address'), prop('addresses', bchFetchData))
              ),
              info: Remote.Success(bchFetchData.wallet),
              latest_block: Remote.Success(bchFetchData.info.latest_block)
            })
          })
      })
    })
  })

  describe('fetchFee', () => {
    const saga = testSaga(dataBchSagas.fetchFee)

    it('should put loading state', () => {
      saga.next().put(A.fetchFeeLoading())
    })

    it('should retrieve fee data', () => {
      saga.next().call(api.getBchFee)
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
        return expectSaga(dataBchSagas.fetchFee)
          .withReducer(reducers)
          .run()
          .then(result => {
            expect(result.storeState.bch).toMatchObject({
              fee: Remote.Success(feeData)
            })
          })
      })
    })
  })

  describe('fetchRates', () => {
    const saga = testSaga(dataBchSagas.fetchRates)

    it('should put loading state', () => {
      saga.next().put(A.fetchRatesLoading())
    })

    it('should retrieve rates data', () => {
      saga.next().call(api.getBchTicker)
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
        return expectSaga(dataBchSagas.fetchRates)
          .withReducer(reducers)
          .run()
          .then(result => {
            expect(result.storeState.bch).toMatchObject({
              rates: Remote.Success(rateData)
            })
          })
      })
    })
  })

  describe('watchTransactions', () => {
    const saga = testSaga(dataBchSagas.watchTransactions)
    const action = {}

    it('should fetch tx', () => {
      saga.next().take(AT.FETCH_BCH_TRANSACTIONS)
    })

    it('should call fetchTransactions', () => {
      saga.next(action).call(dataBchSagas.fetchTransactions, action)
    })

    // Try again
    it('should fetch tx again', () => {
      saga.next().take(AT.FETCH_BCH_TRANSACTIONS)
    })

    it('should call fetchTransactions again', () => {
      saga.next(action).call(dataBchSagas.fetchTransactions, action)
    })
  })

  describe('fetchTransactions', () => {
    const mockContext = 'qryjvc08ml7ep6dvexffrcuy9g9zz084jcgltg35xs'
    const payload = {
      address: CASH_ADDR_ADDRESS,
      reset: false
    }
    const saga = testSaga(dataBchSagas.fetchTransactions, { payload })
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
      saga.next().select(S.getWalletContext)
    })

    it('should select full context', () => {
      saga.next(mockContext).select(S.getContext)
    })

    it('should call fetchBchData', () => {
      saga.next(mockContext).call(api.fetchBchData, mockContext, {
        n: 10,
        onlyShow: fromCashAddr(CASH_ADDR_ADDRESS),
        offset: 10
      })
    })

    it('should set transactionsAtBound', () => {
      saga.next(bchFetchData).put(A.transactionsAtBound(true))
    })

    it('should dispatch success with data', () => {
      saga
        .next(bchFetchData)
        .put(A.fetchTransactionsSuccess(bchFetchData.txs, payload.reset))
    })

    it('should finish', () => {
      saga.next().isDone()
    })

    it('should break if reset is false and at bounds', () => {
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
        return expectSaga(dataBchSagas.fetchTransactions, {
          payload: {
            address: CASH_ADDR_ADDRESS,
            reset: true
          }
        })
          .withReducer(reducers)
          .provide([
            [select(S.getWalletContext), mockContext],
            [select(S.getContext), mockContext],
            [select(S.getTransactions), pages]
          ])
          .run()
          .then(result => {
            expect(result.storeState.bch).toMatchObject({
              transactions: [Remote.Success(bchFetchData.txs)]
            })
          })
      })

      it('should append transaction data to the state if reset is false', () => {
        const initTx = [Remote.Success({ id: 2 }), Remote.Success({ id: 3 })]
        return expectSaga(dataBchSagas.fetchTransactions, {
          payload: {
            address: CASH_ADDR_ADDRESS,
            reset: false
          }
        })
          .withReducer(reducers)
          .withState({
            bch: {
              transactions: [Remote.Success(initTx)]
            }
          })
          .provide([
            [select(S.getWalletContext), mockContext],
            [select(S.getContext), mockContext],
            [select(S.getTransactions), pages]
          ])
          .run()
          .then(result => {
            expect(result.storeState.bch).toMatchObject({
              transactions: append(Remote.Success(bchFetchData.txs), [
                Remote.Success(initTx)
              ])
            })
          })
      })
    })
  })

  describe('fetchTransactionHistory', () => {
    const payload = {
      address: CASH_ADDR_ADDRESS,
      start: '01/01/2018',
      end: '01/06/2018'
    }
    const saga = testSaga(dataBchSagas.fetchTransactionHistory, { payload })
    const currency = Remote.of('EUR')
    const beforeGettingHistory = 'beforeGettingHistory'

    it('should put loading state', () => {
      saga.next().put(A.fetchTransactionHistoryLoading())
    })

    it('should get currency', () => {
      saga.next().select(selectors.settings.getCurrency)
    })

    it('should get transaction data with address if possible', () => {
      let convertedAddress = fromCashAddr(CASH_ADDR_ADDRESS)
      saga.save(beforeGettingHistory)
      saga
        .next(currency)
        .call(
          api.getTransactionHistory,
          'BCH',
          convertedAddress,
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
    const mockContext = [CASH_ADDR_ADDRESS, CASH_ADDR_ADDRESS]
    const active = mockContext.join('|')

    it('should get transaction data with context if no address present', () => {
      return expectSaga(dataBchSagas.fetchTransactionHistory, {
        payload: payloadNoAddr
      })
        .provide([
          [select(selectors.settings.getCurrency), currency],
          [select(S.getContext), mockContext]
        ])
        .call(
          api.getTransactionHistory,
          'BCH',
          active,
          currency.getOrElse('USD'),
          payload.start,
          payload.end
        )
        .put(A.fetchTransactionHistorySuccess(transactionHistory))
        .run()
    })

    it('should handle errors', () => {
      const error = { message: 'invalid address' }

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
        return expectSaga(dataBchSagas.fetchTransactionHistory, { payload })
          .withReducer(reducers)
          .provide([[select(selectors.settings.getCurrency), Remote.of('USD')]])
          .run()
          .then(result => {
            expect(result.storeState.bch).toMatchObject({
              transaction_history: Remote.Success(transactionHistory)
            })
          })
      })

      it('should add transactionHistory data to the state using context if no address', () => {
        return expectSaga(dataBchSagas.fetchTransactionHistory, {
          payload: payloadNoAddr
        })
          .withReducer(reducers)
          .provide([
            [select(selectors.settings.getCurrency), Remote.of('USD')],
            [select(S.getContext), mockContext]
          ])
          .run()
          .then(result => {
            expect(result.storeState.bch).toMatchObject({
              transaction_history: Remote.Success(transactionHistory)
            })
          })
      })
    })
  })
})
