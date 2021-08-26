import { takeEvery } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, coreSagas, networks }) => {
  const goalsSagas = sagas({ api, coreSagas, networks })

  return function * goalsSaga() {
    yield takeEvery(AT.RUN_GOALS, goalsSagas.runGoals)
    yield takeEvery(AT.DEFINE_GOALS, goalsSagas.defineGoals)
  }
}
