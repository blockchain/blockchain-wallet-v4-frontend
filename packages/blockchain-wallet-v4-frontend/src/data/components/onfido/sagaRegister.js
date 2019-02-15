import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'
export default ({ api, coreSagas }) => {
  const { syncOnfido, fetchOnfidoSDKKey } = sagas({ api, coreSagas })
  return function* onfidoSaga () {
    yield takeLatest(AT.FETCH_ONFIDO_SDK_KEY, fetchOnfidoSDKKey)
    yield takeLatest(AT.SYNC_ONFIDO, syncOnfido)
  }
}
