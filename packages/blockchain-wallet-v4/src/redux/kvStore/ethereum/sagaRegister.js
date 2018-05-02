
import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api }) => {
  const kvStoreEthereumSagas = sagas({ api })

  return function * () {
    yield takeLatest(AT.FETCH_METADATA_ETHEREUM, kvStoreEthereumSagas.fetchMetadataEthereum)
  }
}
