import { takeLatest, put } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actions from '../../actions.js'

export const sendEther = function * (action) {
  try {
  } catch (e) {
    yield put(actions.alerts.displayError('Could not send ether.'))
  }
}

export default function * () {
  yield takeLatest(AT.SEND_ETHER, sendEther)
}
