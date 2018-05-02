import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, coreSagas }) => {
  const importBtcAddressSagas = sagas({ api, coreSagas })

  return function * () {
    yield takeLatest(AT.IMPORT_BTC_ADDRESS_SUBMIT_CLICKED, importBtcAddressSagas.importBtcAddressSubmitClicked)
  }
}
