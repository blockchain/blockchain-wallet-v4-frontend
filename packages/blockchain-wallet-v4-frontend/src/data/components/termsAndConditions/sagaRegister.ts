import { takeLatest } from 'redux-saga/effects'

import sagas from './sagas'
import { actions } from './slice'

export default ({ api }) => {
  const termsAndConditionsSagas = sagas({ api })

  return function* termsAndConditionsSaga() {
    yield takeLatest(
      actions.fetchTermsAndConditions.type,
      termsAndConditionsSagas.fetchTermsAndConditions
    )
    yield takeLatest(
      actions.signTermsAndConditions.type,
      termsAndConditionsSagas.signTermsAndConditions
    )
  }
}
