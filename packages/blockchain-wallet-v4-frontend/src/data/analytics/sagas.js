import { put, select, call } from 'redux-saga/effects'

import { actions, selectors } from 'data'
import * as crypto from 'blockchain-wallet-v4/src/walletCrypto'

export const logLocation = 'analytics/sagas'
export default ({ api }) => {
  const postMessage = function*(message) {
    try {
      const targetDomain = (yield select(
        selectors.core.walletOptions.getWalletHelperUrl
      )).getOrFail('Missing target domain')
      const frame = document.getElementById('matomo-iframe')
      frame.contentWindow.postMessage(message, targetDomain)
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'postMessage', e))
    }
  }

  const logEvent = function*() {
    try {
      yield console.log('LOG_EVENT')
      // yield call(postMessage)
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'logEvent', e))
    }
  }

  const logPageView = function*() {
    try {
      yield console.log('LOG_PAGE_VIEW')
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'logPageView', e))
    }
  }

  const logSiteSearch = function*() {
    try {
      yield console.log('LOG_SITE_SEARCH')
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'logSiteSearch', e))
    }
  }

  const resetSession = function*() {
    try {
      yield console.log('RESET_SESSION')
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'resetSession', e))
    }
  }

  const setSession = function*(action) {
    try {
      let { guid } = action.payload
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
      yield put(actions.logs.logErrorMessage(logLocation, 'setSession', e))
    }
  }

  return {
    logEvent,
    logPageView,
    logSiteSearch,
    postMessage,
    resetSession,
    setSession
  }
}
