import { takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, networks }) => {
  const kvStoreWalletCredentialsSagas = sagas({ api, networks })

  return function * coreKvStoreWalletCredentialsSaga() {
    yield takeLatest(
      AT.FETCH_METADATA_WALLET_CREDENTIALS,
      kvStoreWalletCredentialsSagas.fetchMetadataWalletCredentials
    )
  }
}
