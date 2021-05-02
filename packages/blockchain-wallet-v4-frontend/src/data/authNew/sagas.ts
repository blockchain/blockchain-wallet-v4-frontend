import { prop } from 'ramda'
import { call, put, select } from 'redux-saga/effects'

import { actions, selectors } from 'data'
import * as C from 'services/alerts'
import { isGuid } from 'services/forms'

import * as A from './actions'
import { LoginObject, LoginSteps } from './types'

export default ({ api, coreSagas }) => {
  const logLocation = 'auth/sagas'

  const intializeLogin = function * () {
    try {
      yield put(A.intializeLoginLoading())
      const pathname = yield select(selectors.router.getPathname)
      const params = pathname.split('/')
      if (!params[2]) {
        yield put(
          actions.form.change('loginNew', 'step', LoginSteps.ENTER_EMAIL_GUID)
        )
      } else {
        if (isGuid(params[2])) {
          // const values = yield select(
          //   selectors.form.getFormValues('loginNew')
          // )
          // // todo: add GUID to state
          yield put(
            actions.form.change(
              'loginNew',
              'step',
              LoginSteps.VERIFICATION_MOBILE
            )
          )
        } else {
          const loginData = JSON.parse(atob(params[2])) as LoginObject
          const guidFromRoute = prop('guid', loginData)
          const emailFromRoute = prop('email', loginData)
          yield put(actions.form.change('loginNew', 'guid', guidFromRoute))
          yield put(actions.form.change('loginNew', 'email', emailFromRoute))
          yield put(
            actions.form.change(
              'loginNew',
              'step',
              LoginSteps.VERIFICATION_MOBILE
            )
          )
        }
      }
    } catch (e) {
      yield put(A.intializeLoginFailure())
      yield put(actions.logs.logErrorMessage(logLocation, 'intializeLogin', e))
    }
  }

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
    intializeLogin,
    loginGuid
  }
}
