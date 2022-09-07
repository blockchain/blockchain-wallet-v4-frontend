import { takeLatest } from 'redux-saga/effects'

import sagas from './sagas'
import { actions } from './slice'

export default ({ api, coreSagas, networks }) => {
  const referralSagas = sagas({ api, coreSagas, networks })

  return function* referralSaga() {
    yield takeLatest(actions.getReferralInformation.type, referralSagas.getReferralInformation)
  }
}
