import { put } from 'redux-saga/effects'
import { actions } from 'data'
import { push } from 'react-router-redux'
import { actions as reduxFormActions } from 'redux-form'

export const handleSend = function * (action) {
  yield put(reduxFormActions.destroy('sendBitcoin'))
  yield put(actions.modals.closeModal())
  yield put(push('/transactions'))
  yield put(actions.alerts.displaySuccess('Your transaction is being confirmed'))
}
