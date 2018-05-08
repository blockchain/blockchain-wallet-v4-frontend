import { put, call, select } from 'redux-saga/effects'
import * as A from './actions'
import * as actions from '../../actions'
import * as selectors from '../../selectors.js'

export default ({ coreSagas }) => {
  const logLocation = 'modules/coinify/sagas'

  const coinifySignup = function * () {
    try {
      yield call(coreSagas.data.coinify.signup)
      const profile = yield select(selectors.core.data.coinify.getProfile)
      if (!profile.error) {
        yield put(A.coinifyNextStep('order'))
        yield put(actions.alerts.displaySuccess('Account successfully created!'))
      } else {
        yield put(A.coinifySignupFailure(profile.error))
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'coinifySignup', e))
      yield put(actions.alerts.displayError('Failed to create Coinify account.'))
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
      yield put(actions.logs.logErrorMessage(logLocation, 'buy', e))
      yield put(actions.alerts.displayError('Failed to create Coinify trade.'))
    }
  }

  return {
    coinifySignup,
    coinifySaveMedium,
    buy
  }
}
