import * as AT from './actionTypes'
import { takeLatest } from 'redux-saga/effects'
import sagas from './sagas'

export default ({ api, coreSagas, networks }) => {
  const importBchAddressSagas = sagas({ api, coreSagas, networks })

  return function * importBchAddressSaga () {
    yield takeLatest(
      AT.IMPORT_BCH_ADDRESS_SUBMIT_CLICKED,
      importBchAddressSagas.importBchAddressSubmitClicked
    )
  }
}
