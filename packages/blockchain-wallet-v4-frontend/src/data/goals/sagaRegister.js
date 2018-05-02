import { takeEvery } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ coreSagas }) => {
  const goalsSagas = sagas({ coreSagas })

  return function * () {
    yield takeEvery(AT.RUN_GOALS, goalsSagas.runGoals)
  }
}
