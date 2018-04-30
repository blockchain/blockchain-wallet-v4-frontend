import { takeLatest, put, call, select } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as A from './actions'
import * as selectors from '../../selectors.js'
import { actions } from 'data'

export default ({ coreSagas }) => {
  const coinifySignup = function * () {
    try {
      yield call(coreSagas.data.coinify.signup)
      const profile = yield select(selectors.core.data.coinify.getProfile)
      if (!profile.error) {
        yield put(A.coinifyNextStep('isx'))
        yield put(actions.alerts.displaySuccess('Account successfully created!'))
      } else {
        yield put(A.coinifySignupFailure(profile.error))
      }
    } catch (e) {
      yield put(actions.alerts.displayError('Error creating account'))
    }
  }

  const coinifySaveMedium = function * (data) {
    const medium = data.payload
    yield put(A.saveMediumSuccess(medium))
    yield put(A.coinifyNextStep('confirm'))
  }

  const buy = function * (payload) {
    try {
      yield call(coreSagas.data.coinify.buy, payload)
      yield put(actions.alerts.displaySuccess('Buy trade successfully created!'))
      yield put(A.coinifyNextStep('isx'))
    } catch (e) {
      yield put(actions.alerts.displayError('Error buying.'))
    }
  }

  return function * () {
    yield takeLatest(AT.SIGNUP, coinifySignup)
    yield takeLatest(AT.COINIFY_SAVE_MEDIUM, coinifySaveMedium)
    yield takeLatest(AT.COINIFY_BUY, buy)
  }
}
