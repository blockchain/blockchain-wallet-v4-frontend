
import { takeEvery, takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api }) => {
  const kvStoreShapeshiftSagas = sagas({ api })

  return function * () {
    yield takeEvery(AT.FETCH_SHAPESHIFT_TRADE, kvStoreShapeshiftSagas.fetchShapeshiftTrade)
    yield takeLatest(AT.FETCH_METADATA_SHAPESHIFT, kvStoreShapeshiftSagas.fetchMetadataShapeshift)
  }
}
