import * as AT from './actionTypes'
import { takeLatest } from 'redux-saga/effects'
import sagas from './sagas'

export default ({ api, networks }) => {
  const kvStoreBuysellSagas = sagas({ api, networks })

  return function * coreKvStoreBuySellSaga () {
    yield takeLatest(
      AT.FETCH_METADATA_BUYSELL,
      kvStoreBuysellSagas.fetchMetadataBuySell
    )
  }
}
