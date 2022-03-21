import { takeLatest } from 'redux-saga/effects'

import sagas from './sagas'
import { actions } from './slice'

export default ({ api, coreSagas, networks }) => {
  const custodialSagas = sagas({ api, coreSagas, networks })

  return function* custodialSaga() {
    yield takeLatest(actions.fetchCustodialBeneficiaries.type, custodialSagas.fetchBeneficiaries)
    yield takeLatest(actions.fetchRecentSwapTxs.type, custodialSagas.fetchRecentSwapTxs)
    yield takeLatest(
      actions.fetchProductEligibilityForUser.type,
      custodialSagas.fetchProductEligibilityForUser
    )
  }
}
