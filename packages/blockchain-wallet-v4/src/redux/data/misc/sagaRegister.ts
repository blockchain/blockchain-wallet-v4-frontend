import { takeEvery, takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api }) => {
  const dataMiscSagas = sagas({ api })

  return function* coreDataMiscSaga() {
    yield takeLatest(AT.AUTHORIZE_LOGIN, dataMiscSagas.authorizeLogin)
    yield takeEvery(AT.FETCH_PRICE_CHANGE, dataMiscSagas.fetchPriceChange)
    yield takeLatest(AT.FETCH_PRICE_INDEX_SERIES, dataMiscSagas.fetchPriceIndexSeries)
    yield takeLatest(AT.ENCODE_PAIRING_CODE, dataMiscSagas.encodePairingCode)
    yield takeLatest(AT.VERIFY_EMAIL_TOKEN, dataMiscSagas.verifyEmailToken)
    yield takeLatest(AT.HANDLE_2FA_RESET, dataMiscSagas.handle2FAReset)
    yield takeLatest(AT.SECURE_CHANNEL_SEND, dataMiscSagas.sendSecureChannelMessage)
  }
}
