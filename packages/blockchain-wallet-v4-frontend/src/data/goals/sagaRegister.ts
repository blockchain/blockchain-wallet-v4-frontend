import { takeEvery } from 'redux-saga/effects'

import sagas from './sagas'
import { actionTypes } from './slice'

export default ({ api, coreSagas, networks }) => {
  const goalsSagas = sagas({ api, coreSagas, networks })

  return function* goalsSaga() {
    yield takeEvery(actionTypes.runGoals, goalsSagas.runGoals)
    yield takeEvery(actionTypes.defineGoals, goalsSagas.defineGoals)
  }
}
