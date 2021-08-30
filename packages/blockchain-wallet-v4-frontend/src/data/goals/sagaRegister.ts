import { takeEvery } from 'redux-saga/effects'

import sagas from './sagas'
import { defineGoals, runGoals } from './slice'

export default ({ api, coreSagas, networks }) => {
  const goalsSagas = sagas({ api, coreSagas, networks })

  return function* goalsSaga() {
    yield takeEvery(runGoals.type, goalsSagas.runGoals)
    yield takeEvery(defineGoals.type, goalsSagas.defineGoals)
  }
}
