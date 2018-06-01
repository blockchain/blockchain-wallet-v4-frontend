import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, coreSagas }) => {
  const manageAddressesSagas = sagas({ api, coreSagas })

  return function * () {
    yield takeLatest(AT.GENERATE_NEXT_RECEIVE_ADDRESS, manageAddressesSagas.generateNextReceiveAddress)
    yield takeLatest(AT.FETCH_UNUSED_ADDRESSES, manageAddressesSagas.fetchUnusedAddresses)
    yield takeLatest(AT.FETCH_USED_ADDRESSES, manageAddressesSagas.fetchUsedAddresses)
    yield takeLatest(AT.TOGGLE_USED_ADDRESSES, manageAddressesSagas.toggleUsedAddresses)
  }
}
