import { takeEvery } from 'redux-saga/effects'

import sagas from './sagas'
import { actions } from './slice'

export default ({ api, coreSagas, networks }) => {
  const goalsSagas = sagas({ api, coreSagas, networks })

  return function* goalsSaga() {
    yield takeEvery(actions.runGoals.type, goalsSagas.runGoals)
    yield takeEvery(actions.defineGoals.type, goalsSagas.defineGoals)
  }
}
