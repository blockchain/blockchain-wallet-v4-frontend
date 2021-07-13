import { takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, coreSagas, networks }) => {
  const importBtcAddressSagas = sagas({ api, coreSagas, networks })

  return function * importBtcAddressSaga() {
    yield takeLatest(
      AT.IMPORT_BTC_ADDRESS_SUBMIT_CLICKED,
      importBtcAddressSagas.importBtcAddressSubmitClicked
    )
  }
}
