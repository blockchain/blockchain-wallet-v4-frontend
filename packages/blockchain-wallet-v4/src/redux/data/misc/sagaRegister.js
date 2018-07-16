
import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api }) => {
  const dataMiscSagas = sagas({ api })

  return function * () {
    yield takeLatest(AT.AUTHORIZE_LOGIN, dataMiscSagas.authorizeLogin)
    yield takeLatest(AT.FETCH_CAPTCHA, dataMiscSagas.fetchCaptcha)
    yield takeLatest(AT.FETCH_LOGS, dataMiscSagas.fetchLogs)
    yield takeLatest(AT.FETCH_PRICE_INDEX_SERIES, dataMiscSagas.fetchPriceIndexSeries)
    yield takeLatest(AT.ENCODE_PAIRING_CODE, dataMiscSagas.encodePairingCode)
    yield takeLatest(AT.VERIFY_EMAIL_TOKEN, dataMiscSagas.verifyEmailToken)
    yield takeLatest(AT.HANDLE_2FA_RESET, dataMiscSagas.handle2FAReset)
  }
}
