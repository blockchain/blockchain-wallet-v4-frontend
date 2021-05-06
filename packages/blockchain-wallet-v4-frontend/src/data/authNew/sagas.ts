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
      const isMobileConnected = yield select(selectors.cache.getMobileConnected)
      const email = yield select(selectors.cache.getEmail)
      const guid = yield select(selectors.cache.getStoredGuid)
      // debugger
      if (guid && !params[2]) {
        yield put(actions.form.change('loginNew', 'guid', guid))
        yield put(actions.form.change('loginNew', 'email', email))
        if (isMobileConnected) {
          yield put(
            actions.form.change(
              'loginNew',
              'step',
              LoginSteps.VERIFICATION_MOBILE
            )
          )
        } else {
          yield put(
            actions.form.change('loginNew', 'step', LoginSteps.ENTER_PASSWORD)
          )
        }
      } else if (!params[2]) {
        yield put(
          actions.form.change('loginNew', 'step', LoginSteps.ENTER_EMAIL_GUID)
        )
      } else {
        if (isGuid(params[2])) {
          const guidFromRoute = params[2]
          yield put(actions.form.change('loginNew', 'guid', guidFromRoute))
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
          const mobileSetup = prop('is_mobile_setup', loginData) === 'true'
          yield put(actions.cache.emailStored(emailFromRoute))
          yield put(actions.cache.guidStored(guidFromRoute))
          yield put(actions.cache.mobileConnectedStored(mobileSetup))

          yield put(actions.form.change('loginNew', 'guid', guidFromRoute))
          yield put(actions.form.change('loginNew', 'email', emailFromRoute))

          if (mobileSetup) {
            yield put(
              actions.form.change(
                'loginNew',
                'step',
                LoginSteps.VERIFICATION_MOBILE
              )
            )
          } else {
            yield put(
              actions.form.change('loginNew', 'step', LoginSteps.ENTER_PASSWORD)
            )
          }
        }
      }
      yield put(A.initializeLoginSuccess())
    } catch (e) {
      yield put(A.intializeLoginFailure())
      yield put(actions.logs.logErrorMessage(logLocation, 'intializeLogin', e))
    }
  }

  const loginGuid = function * (action) {
    try {
      yield put(A.loginGuidLoading())
      yield put(actions.form.change('loginNew', 'step', LoginSteps.LOADING))
      const sessionToken = yield call(api.obtainSessionToken)
      yield call(coreSagas.wallet.loginGuidSaga, action.payload, sessionToken)
      yield put(actions.form.change('loginNew', 'step', LoginSteps.CHECK_EMAIL))
      yield put(A.loginGuidSuccess())
    } catch (e) {
      yield put(A.loginGuidFailure())
      yield put(actions.logs.logErrorMessage(logLocation, 'loginGuid', e))
      yield put(actions.alerts.displayError(C.GUID_SENT_ERROR))
    }
  }

  const submitWalletGuid = function * (action) {
    try {
      yield put(A.guidWalletLoading())
      yield put(actions.form.change('loginNew', 'step', LoginSteps.LOADING))
      const sessionToken = yield call(api.obtainSessionToken)
      yield call(actions.auth.login, action.payload, sessionToken)
      yield yield put(
        actions.form.change('loginNew', 'step', LoginSteps.VERIFICATION_MOBILE)
      )
    } catch (e) {
      yield put(A.guidWalletFailure())
      yield put(actions.logs.logErrorMessage(logLocation, 'walletGuid', e))
    }
  }

  return {
    intializeLogin,
    loginGuid,
    submitWalletGuid
  }
}
