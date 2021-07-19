import { takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, coreSagas, networks }) => {
  const custodialSagas = sagas({ api, coreSagas, networks })

  return function* custodialSaga() {
    yield takeLatest(AT.FETCH_CUSTODIAL_BENEFICIARIES, custodialSagas.fetchBeneficiaries)
    yield takeLatest(AT.FETCH_RECENT_SWAP_TXS, custodialSagas.fetchRecentSwapTxs)
  }
}
