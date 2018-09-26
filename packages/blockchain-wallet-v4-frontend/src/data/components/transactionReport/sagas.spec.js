import { testSaga } from 'redux-saga-test-plan'
import { coreSagasFactory } from 'blockchain-wallet-v4/src'
import * as actions from '../../actions'
import * as selectors from '../../selectors.js'
import transactionReportSagas, { initialValues, logLocation } from './sagas'
import moment from 'services/MomentHelper'

const coreSagas = coreSagasFactory()

jest.mock('blockchain-wallet-v4/src/redux/sagas')
jest.useFakeTimers()

const MOCK_FORM_VALUES = {
  from: {
    address: 'address'
  },
  start: new Date('9/10/2018'),
  end: new Date('9/20/2018')
}
const START_DATE = moment(MOCK_FORM_VALUES.start).format('DD/MM/YYYY')
const END_DATE = moment(MOCK_FORM_VALUES.end).format('DD/MM/YYYY')

describe('transactionReport sagas', () => {
  describe('initialized', () => {
    let { initialized } = transactionReportSagas({ coreSagas })

    let saga = testSaga(initialized)

    it('should select the language', () => {
      saga.next().select(selectors.preferences.getLanguage)
    })

    it('should initialize the transaction report form', () => {
      saga
        .next('ES')
        .put(actions.form.initialize('transactionReport', initialValues))
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

  describe('destroyed', () => {
    let { destroyed } = transactionReportSagas({ coreSagas })

    let saga = testSaga(destroyed)

    it('should clear btc tx history', () => {
      saga.next().put(actions.core.data.bitcoin.clearTransactionHistory())
    })

    it('should clear bch tx history', () => {
      saga.next().put(actions.core.data.bch.clearTransactionHistory())
    })
  })

  describe('submitClicked BCH', () => {
    let { submitClicked } = transactionReportSagas({ coreSagas })

    let action = { payload: { coin: 'BCH' } }

    let saga = testSaga(submitClicked, action)

    it('should select the form values', () => {
      saga.next(MOCK_FORM_VALUES)
    })

    it('should fetch bch tx history', () => {
      saga
        .next(MOCK_FORM_VALUES)
        .put(
          actions.core.data.bch.fetchTransactionHistory(
            MOCK_FORM_VALUES.from.address,
            START_DATE,
            END_DATE,
            moment(MOCK_FORM_VALUES.end).format('DD/MM/YYYY')
          )
        )
    })
  })

  describe('submitClicked BTC', () => {
    let { submitClicked } = transactionReportSagas({ coreSagas })

    let action = { payload: { coin: 'BTC' } }

    let saga = testSaga(submitClicked, action)

    it('should select the form values', () => {
      saga.next(MOCK_FORM_VALUES)
    })

    it('should fetch btc tx history', () => {
      saga
        .next(MOCK_FORM_VALUES)
        .put(
          actions.core.data.bitcoin.fetchTransactionHistory(
            MOCK_FORM_VALUES.from.address,
            START_DATE,
            END_DATE
          )
        )
    })
  })

  describe('submitClicked with the default case', () => {
    let { submitClicked } = transactionReportSagas({ coreSagas })

    let action = { payload: { coin: undefined } }

    let saga = testSaga(submitClicked, action)

    it('should select the form values', () => {
      saga.next(MOCK_FORM_VALUES)
    })

    it('should fetch btc tx history', () => {
      saga
        .next(MOCK_FORM_VALUES)
        .put(
          actions.core.data.bitcoin.fetchTransactionHistory(
            MOCK_FORM_VALUES.from.address,
            START_DATE,
            END_DATE
          )
        )
    })

    describe('error handling', () => {
      it('should log the error', () => {
        const error = new Error('ERROR')

        saga
          .restart()
          .next()
          .throw(error)
          .put(
            actions.logs.logErrorMessage(logLocation, 'submitClicked', error)
          )
      })
    })
  })
})
