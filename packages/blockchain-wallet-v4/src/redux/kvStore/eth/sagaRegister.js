import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default (...args) => {
  const kvStoreEthSagas = sagas(...args)

  return function * coreKvStoreEthSaga () {
    yield takeLatest(AT.FETCH_METADATA_ETH, kvStoreEthSagas.fetchMetadataEth)
  }
}
