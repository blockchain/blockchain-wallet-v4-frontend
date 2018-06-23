import { put } from 'redux-saga/effects'
import * as actions from '../../actions.js'
import * as C from 'services/AlertService'

export default () => {
  const logLocation = 'components/requestBtc/sagas'

  const firstStepSubmitClicked = function * (action) {
    try {
      let { accountIdx, addressIdx, message } = action.payload
      yield put(actions.core.wallet.setHdAddressLabel(accountIdx, addressIdx, message))
    } catch (error) {
      yield put(actions.logs.logErrorMessage(logLocation, 'firstStepSubmitClicked', error))
    }
  }

  const btcPaymentReceived = function * (action) {
    yield put(actions.alerts.displaySuccess(C.RECEIVE_BTC_SUCCESS))
  }

  return {
    firstStepSubmitClicked,
    btcPaymentReceived
  }
}
