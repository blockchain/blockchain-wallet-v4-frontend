import { call, delay, put, select } from 'redux-saga/effects'

import { actions, selectors } from 'data'
import * as C from 'services/alerts'

export default ({ api }) => {
  const logLocation = 'session/sagas'

  const logoutClearReduxStore = function* () {
    // router will fallback to /login route
    yield window.history.pushState('', '', '#')
    yield window.location.reload()
  }

  const logout = function* () {
    try {
      yield put(actions.modules.profile.clearSession())
      yield put(actions.middleware.webSocket.rates.stopSocket())
      yield put(actions.middleware.webSocket.coins.stopSocket())
      yield put(actions.middleware.webSocket.xlm.stopStreams())
      // sets logout time so we know whether or not to
      // send notification to mobile phone for login
      yield put(actions.cache.lastLogoutTimestamp(Date.now()))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'logout', e))
    } finally {
      const isEmailVerified = (yield select(selectors.core.settings.getEmailVerified)).getOrElse(0)
      // only show browser de-auth page to accounts with verified email
      // delay allows for all actions to run and complete before clearing redux store
      yield delay(100)
      if (isEmailVerified) {
        yield put(actions.router.push('/logout'))
      } else {
        yield call(logoutClearReduxStore)
      }
    }
  }

  const deauthorizeBrowser = function* () {
    try {
      const guid = yield select(selectors.core.wallet.getGuid)
      const email = (yield select(selectors.core.settings.getEmail)).getOrElse(undefined)
      const sessionToken = yield select(selectors.session.getSession, guid, email)
      yield call(api.deauthorizeBrowser, sessionToken)
      yield put(actions.cache.removeStoredLogin())
      yield put(actions.alerts.displaySuccess(C.DEAUTHORIZE_BROWSER_SUCCESS))
      yield put(actions.cache.disconnectChannelPhone())
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'deauthorizeBrowser', e))
      yield put(actions.alerts.displayError(C.DEAUTHORIZE_BROWSER_ERROR))
    } finally {
      yield logoutClearReduxStore()
    }
  }

  return {
    deauthorizeBrowser,
    logout,
    logoutClearReduxStore
  }
}
