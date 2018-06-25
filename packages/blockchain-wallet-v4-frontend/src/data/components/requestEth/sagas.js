import { put } from 'redux-saga/effects'
import * as actions from '../../actions.js'
import * as C from 'services/AlertService'

export default () => {
  const ethPaymentReceived = function * (action) {
    yield put(actions.alerts.displaySuccess(C.RECEIVE_ETH_SUCCESS))
  }

  return {
    ethPaymentReceived
  }
}
