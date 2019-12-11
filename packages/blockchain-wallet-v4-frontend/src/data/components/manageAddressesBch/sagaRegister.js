import * as AT from './actionTypes'
import { takeLatest } from 'redux-saga/effects'
import sagas from './sagas'

export default ({ api, networks }) => {
  const manageAddressesSagas = sagas({ api, networks })

  return function * () {
    yield takeLatest(
      AT.EDIT_IMPORTED_ADDRESS_LABEL,
      manageAddressesSagas.editAddressLabel
    )
  }
}
