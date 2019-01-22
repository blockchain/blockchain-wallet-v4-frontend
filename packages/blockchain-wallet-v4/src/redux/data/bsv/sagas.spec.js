import { select } from 'redux-saga/effects'
import { indexBy, path, prop, append } from 'ramda'
import * as A from './actions'
import * as AT from './actionTypes'
import * as S from './selectors'
import { fromCashAddr } from '../../../utils/bsv'

import { Remote } from 'blockchain-wallet-v4/src'
import { expectSaga, testSaga } from 'redux-saga-test-plan'
import sagas from './sagas'
import reducers from '../reducers'

const CASH_ADDR_ADDRESS = 'qq07l6rr5lsdm3m80qxw80ku2ex0tj76vvsxpvmgme'
const bsvFetchData = {
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
      time: 1552300000
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
  fetchBsvData: jest.fn(() => bsvFetchData),
  getBsvFee: jest.fn(() => feeData),
  getBsvFiatAtTime: jest.fn(() => fiatAtTime),
  getBsvTicker: jest.fn(() => rateData),
  getTransactionHistory: jest.fn(() => transactionHistory)
}

describe('bsv data sagas', () => {
  const dataBsvSagas = sagas({ api })

  describe('fetchData', () => {
    const mockContext = 'qryjvc08ml7ep6dvexffrcuy9g9zz084jcgltg35xs'
    const bsvData = {
      addresses: indexBy(prop('address'), prop('addresses', bsvFetchData)),
      info: path(['wallet'], bsvFetchData),
      latest_block: path(['info', 'latest_block'], bsvFetchData)
    }

    const saga = testSaga(dataBsvSagas.fetchData)

    it('should put loading state', () => {
      saga.next().put(A.fetchDataLoading())
    })

    it('should select wallet', () => {
      saga.next().select(S.getContext)
    })

    it('should get data from api', () => {
      saga.next(mockContext).call(api.fetchBsvData, mockContext, { n: 1 })
    })

    it('should dispatch success action', () => {
      saga
        .next(bsvFetchData)
        .put(A.fetchDataSuccess(bsvData))
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
      it('should add bsv data to the state', () => {
        return expectSaga(dataBsvSagas.fetchData)
          .withReducer(reducers)
          .provide([[select(S.getContext), mockContext]])
          .run()
          .then(result => {
            expect(result.storeState.bsv).toMatchObject({
              addresses: Remote.Success(
                indexBy(prop('address'), prop('addresses', bsvFetchData))
              ),
              info: Remote.Success(bsvFetchData.wallet),
              latest_block: Remote.Success(bsvFetchData.info.latest_block)
            })
          })
      })
    })
  })

  describe('fetchFee', () => {
    const saga = testSaga(dataBsvSagas.fetchFee)

    it('should put loading state', () => {
      saga.next().put(A.fetchFeeLoading())
    })

    it('should retrieve fee data', () => {
      saga.next().call(api.getBsvFee)
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
        return expectSaga(dataBsvSagas.fetchFee)
          .withReducer(reducers)
          .run()
          .then(result => {
            expect(result.storeState.bsv).toMatchObject({
              fee: Remote.Success(feeData)
            })
          })
      })
    })
  })

  describe('fetchRates', () => {
    const saga = testSaga(dataBsvSagas.fetchRates)

    it('should put loading state', () => {
      saga.next().put(A.fetchRatesLoading())
    })

    it('should retrieve rates data', () => {
      saga.next().call(api.getBsvTicker)
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
        return expectSaga(dataBsvSagas.fetchRates)
          .withReducer(reducers)
          .run()
          .then(result => {
            expect(result.storeState.bsv).toMatchObject({
              rates: Remote.Success(rateData)
            })
          })
      })
    })
  })

  describe('watchTransactions', () => {
    const saga = testSaga(dataBsvSagas.watchTransactions)
    const action = {}

    it('should fetch tx', () => {
      saga.next().take(AT.FETCH_BSV_TRANSACTIONS)
    })

    it('should call fetchTransactions', () => {
      saga.next(action).call(dataBsvSagas.fetchTransactions, action)
    })

    // Try again
    it('should fetch tx again', () => {
      saga.next().take(AT.FETCH_BSV_TRANSACTIONS)
    })

    it('should call fetchTransactions again', () => {
      saga.next(action).call(dataBsvSagas.fetchTransactions, action)
    })
  })

  describe('fetchTransactions', () => {
    const mockContext = 'qryjvc08ml7ep6dvexffrcuy9g9zz084jcgltg35xs'
    const payload = {
      address: CASH_ADDR_ADDRESS,
      reset: false
    }
    const saga = testSaga(dataBsvSagas.fetchTransactions, { payload })
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

    it('should select full context', () => {
      saga.next().select(S.getContext)
    })

    it('should call fetchBsvData', () => {
      saga.next(mockContext).call(api.fetchBsvData, mockContext, {
        n: 5,
        onlyShow: fromCashAddr(CASH_ADDR_ADDRESS),
        offset: 5
      })
    })

    it('should set transactionsAtBound', () => {
      saga.next(bsvFetchData).put(A.transactionsAtBound(true))
    })

    it('should dispatch success with data', () => {
      saga
        .next(bsvFetchData)
        .put(A.fetchTransactionsSuccess(bsvFetchData.txs, payload.reset))
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
        return expectSaga(dataBsvSagas.fetchTransactions, {
          payload: {
            address: CASH_ADDR_ADDRESS,
            reset: true
          }
        })
          .withReducer(reducers)
          .provide([
            [select(S.getContext), mockContext],
            [select(S.getTransactions), pages]
          ])
          .run()
          .then(result => {
            expect(result.storeState.bsv).toMatchObject({
              transactions: [Remote.Success(bsvFetchData.txs)]
            })
          })
      })

      it('should append transaction data to the state if reset is false', () => {
        const initTx = [Remote.Success({ id: 2 }), Remote.Success({ id: 3 })]
        return expectSaga(dataBsvSagas.fetchTransactions, {
          payload: {
            address: CASH_ADDR_ADDRESS,
            reset: false
          }
        })
          .withReducer(reducers)
          .withState({
            bsv: {
              transactions: [Remote.Success(initTx)]
            }
          })
          .provide([
            [select(S.getContext), mockContext],
            [select(S.getTransactions), pages]
          ])
          .run()
          .then(result => {
            expect(result.storeState.bsv).toMatchObject({
              transactions: append(Remote.Success(bsvFetchData.txs), [
                Remote.Success(initTx)
              ])
            })
          })
      })
    })
  })
})
