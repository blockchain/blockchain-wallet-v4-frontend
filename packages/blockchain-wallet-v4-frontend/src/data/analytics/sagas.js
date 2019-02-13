import { put, select, call } from 'redux-saga/effects'
import { map, toLower } from 'ramda'
import { actions, selectors } from 'data'
import * as crypto from 'blockchain-wallet-v4/src/walletCrypto'

export const logLocation = 'analytics/sagas'
export default ({ api }) => {
  const postMessage = function*(message) {
    try {
      // const targetDomain = (yield select(
      //   selectors.core.walletOptions.getWalletHelperUrl
      // )).getOrFail('Missing target domain')
      const frame = document.getElementById('matomo-iframe')
      frame.contentWindow.postMessage(message, '*')
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'postMessage', e))
    }
  }

  const initUserSession = function*() {
    try {
      const guid = yield select(selectors.wallet.getGuid)
      yield call(startSession, { guid })
      yield call(logPageView, { route: '/home' })
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'initUserSession', e))
    }
  }

  const logEvent = function*(action) {
    try {
      const { event } = action.payload
      yield call(postMessage, {
        method: 'trackEvent',
        messageData: map(toLower, event)
      })
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'logEvent', e))
    }
  }

  const logPageView = function*(action) {
    try {
      const { route } = action.payload
      const isAuthenticated = yield select(selectors.auth.isAuthenticated)
      // only log authenticated page views
      if (isAuthenticated) {
        yield call(postMessage, {
          method: 'logPageView',
          messageData: { route }
        })
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'logPageView', e))
    }
  }

  const logGoal = function*() {
    try {
      // TODO
      yield
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'logGoal', e))
    }
  }

  const startSession = function*(action) {
    try {
      const { guid } = action.payload
      yield call(postMessage, {
        method: 'setUserId',
        messageData: [
          crypto
            .sha256(guid)
            .toString('hex')
            .slice(0, 15)
        ]
      })
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'startSession', e))
    }
  }

  const stopSession = function*() {
    try {
      yield call(postMessage, { method: 'resetUserId', messageData: [] })
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'stopSession', e))
    }
  }

  return {
    logEvent,
    logPageView,
    logGoal,
    initUserSession,
    postMessage,
    startSession,
    stopSession
  }
}
