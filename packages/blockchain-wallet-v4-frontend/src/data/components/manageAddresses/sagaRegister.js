import { takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, networks }) => {
  const manageAddressesSagas = sagas({ api, networks })

  return function * manageAddressesSaga() {
    yield takeLatest(
      AT.DELETE_ADDRESS_LABEL,
      manageAddressesSagas.deleteAddressLabel
    )
    yield takeLatest(
      AT.EDIT_ADDRESS_LABEL,
      manageAddressesSagas.editAddressLabel
    )
    yield takeLatest(
      AT.EDIT_IMPORTED_ADDRESS_LABEL,
      manageAddressesSagas.editImportedAddressLabel
    )
    yield takeLatest(
      AT.GENERATE_NEXT_RECEIVE_ADDRESS,
      manageAddressesSagas.generateNextReceiveAddress
    )
    yield takeLatest(
      AT.FETCH_UNUSED_ADDRESSES,
      manageAddressesSagas.fetchUnusedAddresses
    )
    yield takeLatest(
      AT.FETCH_USED_ADDRESSES,
      manageAddressesSagas.fetchUsedAddresses
    )
    yield takeLatest(
      AT.TOGGLE_USED_ADDRESSES,
      manageAddressesSagas.toggleUsedAddresses
    )
  }
}
