import { takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, coreSagas, networks }) => {
  const fundRecoverySagas = sagas({ api, coreSagas, networks })

  return function* fundRecoverySaga() {
    yield takeLatest(AT.SEARCH_CHAIN_FOR_FUNDS, fundRecoverySagas.searchChainForFunds)
  }
}
