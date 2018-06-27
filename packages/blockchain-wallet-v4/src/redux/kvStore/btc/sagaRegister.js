import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api }) => {
  const kvStoreBtcSagas = sagas({ api })

  return function * () {
    yield takeLatest(AT.FETCH_METADATA_BTC, kvStoreBtcSagas.fetchMetadataBtc)
    yield takeLatest(AT.CREATE_METADATA_BTC, kvStoreBtcSagas.createMetadataBtc)
  }
}
