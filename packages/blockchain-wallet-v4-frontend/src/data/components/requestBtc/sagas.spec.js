import * as C from 'services/AlertService'
import { actions } from 'data'
import { expectSaga, testSaga } from 'redux-saga-test-plan'
import sagas from './sagas.js'

const requestBtcSagas = sagas({ networks: 'btc' })

describe('requestBtc sagas', () => {
  const mockMath = Object.create(global.Math)
  mockMath.random = () => 0.5
  global.Math = mockMath

  describe('firstStepSubmitClicked', () => {
    const accountIdx = 0
    const addressIdx = 13
    const message = 'laundry'

    const action = { payload: { accountIdx, addressIdx, message } }

    it('should update setHdAddressLabel', () => {
      expectSaga(requestBtcSagas.firstStepSubmitClicked, action)
        .put(
          actions.core.wallet.setHdAddressLabel(accountIdx, addressIdx, message)
        )
        .run()
    })

    describe('error handling', () => {
      const error = {}
      const logLocation = 'components/requestBtc/sagas'
      it('should log errors', () => {
        const saga = testSaga(requestBtcSagas.firstStepSubmitClicked, action)

        saga
          .next()
          .throw(error)
          .put(
            actions.logs.logErrorMessage(
              logLocation,
              'firstStepSubmitClicked',
              error
            )
          )
          .next()
          .isDone()
      })
      it('should throw if accountIdx is not integer', () => {
        const accountIdx = 'address123'
        const addressIdx = 'address123'
        const message = 'laundry'

        const action = { payload: { accountIdx, addressIdx, message } }
        const saga = testSaga(requestBtcSagas.firstStepSubmitClicked, action)
        saga
          .next()
          .put(
            actions.logs.logErrorMessage(
              logLocation,
              'firstStepSubmitClicked',
              new Error('accountIdx must be integer')
            )
          )
          .next()
          .isDone()
      })
    })
  })

  describe('btcPaymentReceived', () => {
    const action = { payload: {} }

    it('should display success alert', () => {
      expectSaga(requestBtcSagas.btcPaymentReceived, action)
        .put(actions.alerts.displaySuccess(C.RECEIVE_BTC_SUCCESS))
        .run()
    })
  })
})
