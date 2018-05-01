import { takeLatest, put } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actions from '../../actions.js'

export default () => {
  const toggleUsedAddresses = function * () {
    yield put(actions.modals.closeAllModals())
  }

  return function * () {
    yield takeLatest(AT.TOGGLE_USED_ADDRESSES, toggleUsedAddresses)
  }
}
