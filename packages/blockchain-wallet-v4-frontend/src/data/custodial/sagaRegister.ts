import { takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api }) => {
  const custodialSagas = sagas({ api })

  return function * custodialSaga() {
    yield takeLatest(
      AT.FETCH_CUSTODIAL_BENEFICIARIES,
      custodialSagas.fetchBeneficiaries
    )
  }
}
