import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default () => {
  const usedAddressesSagas = sagas()

  return function* () {
    yield takeLatest(AT.TOGGLE_USED_ADDRESSES, usedAddressesSagas.toggleUsedAddresses)
  }
}
