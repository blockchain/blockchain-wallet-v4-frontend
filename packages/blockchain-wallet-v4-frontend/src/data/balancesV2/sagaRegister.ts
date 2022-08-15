import { takeLatest } from 'redux-saga/effects'

import sagas from './sagas'
import { actions } from './slice'

export default ({ api, coreSagas, networks }) => {
  const balancesV2Sagas = sagas({ api, coreSagas, networks })

  return function* balancesV2Saga() {
    yield takeLatest(actions.fetchUnifiedBalances.type, balancesV2Sagas.fetchUnifiedBalances)
    yield takeLatest(actions.initializeSubscriptions.type, balancesV2Sagas.initializeSubscriptions)
    yield takeLatest(actions.unsubscribe.type, balancesV2Sagas.unsubscribe)
  }
}
