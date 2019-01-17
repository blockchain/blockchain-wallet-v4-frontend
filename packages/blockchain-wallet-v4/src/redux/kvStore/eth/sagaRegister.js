import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, networks }) => {
  const kvStoreEthereumSagas = sagas({ api, networks })

  return function* coreKvStoreEthSaga () {
    yield takeLatest(
      AT.FETCH_METADATA_ETHEREUM,
      kvStoreEthereumSagas.fetchMetadataEthereum
    )
  }
}
