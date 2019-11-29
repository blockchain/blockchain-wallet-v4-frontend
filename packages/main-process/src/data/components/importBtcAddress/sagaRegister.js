import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default (...args) => {
  const importBtcAddressSagas = sagas(...args)

  return function * importBtcAddressSaga () {
    yield takeLatest(
      AT.IMPORT_BTC_ADDRESS_SUBMIT_CLICKED,
      importBtcAddressSagas.importBtcAddressSubmitClicked
    )
  }
}
