import { takeEvery, take, put, race } from 'redux-saga/effects'
import { actions as reduxFormActions } from 'redux-form'
import { push } from 'react-router-redux'
import { actions, actionTypes } from 'data'

export const readQrCode = function * () {
  yield put(actions.modals.showModal('QRCode'))

  // let { success, error } = yield race({
  //   success: take(actionTypes.CAPTURE_QR_SUCCESS),
  //   error: take(AT.CAPTURE_QR_ERROR)
  // })

  // yield put(actions.modals.closeModal())

  // if (success) return success.payload
  // else throw new Error(error.payload)
}

export const readQrAndAlert = function * () {
  try {
    let result = yield readQrCode()
    yield put(actions.alerts.displaySuccess(result))
  } catch (error) {
    yield put(actions.alerts.displayError(error.message))
  }
}

const sendBitcoin = function * (action) {
  yield put(reduxFormActions.destroy('sendBitcoin'))
  yield put(actions.modals.closeModal())
  yield put(push('/transactions'))
  yield put(actions.alerts.displaySuccess('Your transaction is being confirmed'))
}

function * sagas () {
  yield takeEvery(actionTypes.core.payment.signAndPublish, sendBitcoin)
}

export default sagas
