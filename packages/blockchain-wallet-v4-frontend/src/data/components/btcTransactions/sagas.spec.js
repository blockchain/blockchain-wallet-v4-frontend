import { actions, model } from 'data'
import { coreSagasFactory } from 'blockchain-wallet-v4/src'
import { testSaga } from 'redux-saga-test-plan'
import btcTransactionsSagas, { logLocation } from './sagas'

const coreSagas = coreSagasFactory()

jest.mock('blockchain-wallet-v4/src/redux/sagas')

describe('btcTransactions sagas', () => {
  describe('initialized', () => {
    let { initialized } = btcTransactionsSagas({ coreSagas })

    let saga = testSaga(initialized)

    const defaultSource = 'all'
    const initialValues = {
      source: defaultSource,
      status: '',
      search: ''
    }

    it('should initialize the form with initial values', () => {
      saga
        .next()
        .put(
          actions.form.initialize(model.form.WALLET_TX_SEARCH, initialValues)
        )
    })

    it('should dispatch an action to fetch txs', () => {
      saga.next().put(actions.core.data.btc.fetchTransactions('', true))
    })

    describe('error handling', () => {
      const error = new Error('ERROR')
      it('should log the error', () => {
        saga
          .restart()
          .next()
          .throw(error)
          .put(actions.logs.logErrorMessage(logLocation, 'initialized', error))
      })
    })
  })

  describe('formChanged with show all', () => {
    let { formChanged } = btcTransactionsSagas({ coreSagas })
    const action = {
      meta: {
        form: model.form.WALLET_TX_SEARCH,
        field: 'source'
      },
      payload: 'all'
    }

    let saga = testSaga(formChanged, action)

    it('should fetch transactions', () => {
      saga
        .next()
        .put(
          actions.core.data.btc.fetchTransactions(
            action.payload === 'all' ? '' : 'some_address',
            true
          )
        )
    })

    describe('error handling', () => {
      const error = new Error()
      it('should log the error', () => {
        saga
          .restart()
          .next()
          .throw(error)
          .put(actions.logs.logErrorMessage(logLocation, 'formChanged', error))
      })
    })
  })

  describe('formChanged with show one address', () => {
    let { formChanged } = btcTransactionsSagas({ coreSagas })
    const action = {
      meta: {
        form: model.form.WALLET_TX_SEARCH,
        field: 'source'
      },
      payload: {
        address: 'some_address'
      }
    }

    let saga = testSaga(formChanged, action)

    it('should fetch transactions', () => {
      saga
        .next()
        .put(
          actions.core.data.btc.fetchTransactions(
            action.payload === 'all' ? '' : 'some_address',
            true
          )
        )
    })
  })
})
