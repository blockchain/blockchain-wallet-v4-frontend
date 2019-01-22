import { takeEvery, takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, networks }) => {
  const kvStoreShapeshiftSagas = sagas({ api, networks })

  return function* coreKvStoreShapeshiftSaga () {
    yield takeEvery(
      AT.FETCH_SHAPESHIFT_TRADE,
      kvStoreShapeshiftSagas.fetchShapeshiftTrade
    )
    yield takeLatest(
      AT.FETCH_METADATA_SHAPESHIFT,
      kvStoreShapeshiftSagas.fetchMetadataShapeshift
    )
  }
}
