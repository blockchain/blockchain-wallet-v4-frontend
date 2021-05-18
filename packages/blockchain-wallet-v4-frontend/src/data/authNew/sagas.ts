import { prop } from 'ramda'
import { startSubmit, stopSubmit } from 'redux-form'
import { call, put, select } from 'redux-saga/effects'

import { actions, selectors } from 'data'
import * as C from 'services/alerts'
import { isGuid } from 'services/forms'

import * as A from './actions'
import { LoginObject, LoginSteps } from './types'

export default ({ api, coreSagas }) => {
  const logLocation = 'auth/sagas'

  const initializeLogin = function* () {
    try {
      yield put(A.initializeLoginLoading())
      // Opens coin socket, needed for coin streams and channel key for mobile login
      yield put(actions.ws.startSocket())
      // Grab pathname to determine next step
      // Depending on if pathname is just /login
      // /login/{guid} or /login/{base64_link}
      const pathname = yield select(selectors.router.getPathname)
      const params = pathname.split('/')
      const isMobileConnected = yield select(selectors.cache.getMobileConnected)
      const email = yield select(selectors.cache.getEmail)
      // Check for both stored GUID (from email) and lastGuid (last successful login)
      const storedGuid = yield select(selectors.cache.getStoredGuid)
      const lastGuid = yield select(selectors.cache.getLastGuid)
      if ((storedGuid || lastGuid) && !params[2]) {
        // logic to be compatible with lastGuid in cache make sure that email matches
        // guid being used for login eventually can deprecate after some time
        if (lastGuid === storedGuid) {
          yield put(actions.form.change('login', 'guid', lastGuid))
          yield put(actions.form.change('login', 'email', email))
        } else if (lastGuid) {
          yield put(actions.form.change('login', 'guid', lastGuid))
        } else {
          yield put(actions.form.change('login', 'guid', storedGuid))
          yield put(actions.form.change('login', 'email', email))
        }
        if (isMobileConnected) {
          yield put(actions.form.change('login', 'step', LoginSteps.VERIFICATION_MOBILE))
        } else {
          yield put(actions.form.change('login', 'step', LoginSteps.ENTER_PASSWORD))
        }
        // if url is just /login, take them to enter guid or email
      } else if (!params[2]) {
        yield put(actions.form.change('login', 'step', LoginSteps.ENTER_EMAIL_GUID))
        // we detect a guid in the pathname
      } else if (isGuid(params[2])) {
        const guidFromRoute = params[2]
        yield put(actions.form.change('login', 'guid', guidFromRoute))
        yield put(actions.form.change('login', 'step', LoginSteps.VERIFICATION_MOBILE))
        // if path has base64 encrypted JSON
      } else {
        const loginData = JSON.parse(atob(params[2])) as LoginObject
        // grab all the data from the JSON
        const guidFromRoute = prop('guid', loginData)
        const emailFromRoute = prop('email', loginData)
        const mobileSetup = prop('is_mobile_setup', loginData) === 'true'
        const emailToken = prop('email_code', loginData)
        // store data in the cache and update form values
        // to be used to submit login
        yield put(actions.cache.emailStored(emailFromRoute))
        yield put(actions.cache.guidStored(guidFromRoute))
        yield put(actions.cache.mobileConnectedStored(mobileSetup))
        yield put(actions.form.change('login', 'emailToken', emailToken))
        yield put(actions.form.change('login', 'guid', guidFromRoute))
        yield put(actions.form.change('login', 'email', emailFromRoute))
        // check if mobile detected
        if (mobileSetup) {
          yield put(actions.form.change('login', 'step', LoginSteps.VERIFICATION_MOBILE))
        } else {
          yield put(actions.form.change('login', 'step', LoginSteps.ENTER_PASSWORD))
        }
      }
      yield put(A.initializeLoginSuccess())
    } catch (e) {
      yield put(A.initializeLoginFailure())
      yield put(actions.logs.logErrorMessage(logLocation, 'initializeLogin', e))
    }
  }

  // triggers verification email for login
  const loginGuid = function* (action) {
    const formValues = yield select(selectors.form.getFormValues('login'))
    const { step } = formValues
    yield put(startSubmit('login'))
    try {
      yield put(A.loginGuidLoading())
      const sessionToken = yield call(api.obtainSessionToken)
      yield call(coreSagas.wallet.loginGuidSaga, action.payload, sessionToken)
      if (step === LoginSteps.CHECK_EMAIL) {
        yield put(actions.alerts.displayInfo(C.VERIFY_EMAIL_SENT))
      } else {
        yield put(actions.form.change('login', 'step', LoginSteps.CHECK_EMAIL))
      }
      yield put(stopSubmit('login'))
      yield put(A.loginGuidSuccess())
    } catch (e) {
      yield put(A.loginGuidFailure())
      yield put(stopSubmit('login'))
      yield put(actions.logs.logErrorMessage(logLocation, 'loginGuid', e))
      yield put(actions.alerts.displayError(C.VERIFY_EMAIL_SENT_ERROR))
    }
  }

  // TODO: I don't think I ended up using this, probably can remove
  const submitWalletGuid = function* (action) {
    yield put(startSubmit('login'))
    try {
      yield put(A.guidWalletLoading())
      const sessionToken = yield call(api.obtainSessionToken)
      yield call(actions.auth.login, action.payload, sessionToken)
      yield yield put(actions.form.change('login', 'step', LoginSteps.VERIFICATION_MOBILE))
      yield put(stopSubmit('login'))
      yield put(A.guidWalletSuccess())
    } catch (e) {
      yield put(A.guidWalletFailure())
      yield put(stopSubmit('login'))
      yield put(actions.logs.logErrorMessage(logLocation, 'walletGuid', e))
    }
  }

  return {
    initializeLogin,
    loginGuid,
    submitWalletGuid
  }
}
