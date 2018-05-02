import { all, takeEvery, select, call, put } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actions from '../actions'
import * as selectors from '../selectors'
import { Exchange } from 'blockchain-wallet-v4/src'
import sagas from './sagas'

export default ({ coreSagas }) => {
  const goalsSagas = sagas({ coreSagas })

  return function * () {
    yield takeEvery(AT.RUN_GOALS, goalsSagas.runGoals)
  }
}
