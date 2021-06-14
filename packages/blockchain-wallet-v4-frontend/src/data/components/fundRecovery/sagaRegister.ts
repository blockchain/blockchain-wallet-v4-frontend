import { takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api }) => {
  const fundRecoverySagas = sagas({ api })

  return function* fundRecoverySaga() {
    yield takeLatest(AT.SEARCH_CHAIN_FOR_FUNDS, fundRecoverySagas.searchChainForFunds)
    yield takeLatest(AT.RECOVER_FUNDS, fundRecoverySagas.recoverFunds)
  }
}
