import { takeEvery } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api }) => {
  const goalsSagas = sagas({ api })

  return function*() {
    yield takeEvery(AT.RUN_GOALS, goalsSagas.runGoals)
    yield takeEvery(AT.DEFINE_GOALS, goalsSagas.defineGoals)
  }
}
