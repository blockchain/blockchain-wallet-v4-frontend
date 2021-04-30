import { call, put } from 'redux-saga/effects'

import { actions } from 'data'
import * as C from 'services/alerts'

import * as A from './actions'

export default ({ api, coreSagas }) => {
  const logLocation = 'auth/sagas'

  const loginGuid = function * (action) {
    try {
      yield put(A.loginGuidLoading())
      const sessionToken = yield call(api.obtainSessionToken)
      yield call(coreSagas.wallet.loginGuidSaga, action.payload, sessionToken)
      // yield call(api.loginGuid, action.payload, sessionToken)
      yield put(actions.form.change('loginNew', 'step', 4))
      yield put(A.loginGuidSuccess())
    } catch (e) {
      yield put(A.loginGuidFailure())
      yield put(actions.logs.logErrorMessage(logLocation, 'loginGuid', e))
      yield put(actions.alerts.displayError(C.GUID_SENT_ERROR))
    }
  }

  return {
    loginGuid
  }
}
