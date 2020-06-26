import * as AT from './actionTypes'
import { takeLatest } from 'redux-saga/effects'
import sagas from './sagas'

export default ({ api, networks }) => {
  const kvStoreEthSagas = sagas({ api, networks })

  return function * coreKvStoreEthSaga () {
    yield takeLatest(AT.FETCH_METADATA_ETH, kvStoreEthSagas.fetchMetadataEth)
  }
}
