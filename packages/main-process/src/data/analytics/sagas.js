import { call, put, select, take } from 'redux-saga/effects'
import { map, toLower } from 'ramda'
import Bitcoin from 'bitcoinjs-lib'
import BIP39 from 'bip39'

import { Remote } from 'blockchain-wallet-v4/src'
import * as crypto from 'blockchain-wallet-v4/src/walletCrypto'
import { actionTypes, actions, selectors } from 'data'
import { CUSTOM_DIMENSIONS } from './model'

export const logLocation = 'analytics/sagas'
export default ({ api }) => {
  const waitForUserId = function * () {
    const userId = yield select(
      selectors.core.kvStore.userCredentials.getUserId
    )
    if (Remote.Success.is(userId)) return userId.getOrElse(null)
    yield take(
      actionTypes.core.kvStore.userCredentials
        .FETCH_METADATA_USER_CREDENTIALS_SUCCESS
    )
    return (yield select(
      selectors.core.kvStore.userCredentials.getUserId
    )).getOrElse(null)
  }

  const postMessage = function * (message) {
    try {
      const frame = document.getElementById('matomo-iframe')
      if (frame) {
        frame.contentWindow.postMessage(message, '*')
      } else {
        yield put(
          actions.logs.logErrorMessage(
            logLocation,
            'postMessage',
            'matomo iframe missing'
          )
        )
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'postMessage', e))
    }
  }

  const generateUniqueUserID = function * () {
    return yield call(waitForUserId) || ``
  }

  const initUserSession = function * () {
    try {
      const guid = yield call(generateUniqueUserID)
      const isCryptoDisplayed = yield select(
        selectors.preferences.getCoinDisplayed
      )
      yield call(startSession, { payload: { guid } })
      yield call(postMessage, {
        method: 'setCustomDimension',
        messageData: {
          dimensionId: CUSTOM_DIMENSIONS.CURRENCY_PREFERENCE,
          dimensionValue: isCryptoDisplayed ? 'crypto' : 'fiat'
        }
      })
      yield call(logPageView, { payload: { route: '/home' } })
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'initUserSession', e))
    }
  }

  const logEvent = function * (action) {
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

  const createABTest = function * (action) {
    try {
      const { test } = action.payload
      yield call(postMessage, {
        method: 'AbTesting::create',
        messageData: { name: test }
      })
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'logABTest', e))
    }
  }

  const logPageView = function * (action) {
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

  const logGoal = function * () {
    try {
      // TODO
      yield
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'logGoal', e))
    }
  }

  const startSession = function * (action) {
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

  const stopSession = function * () {
    try {
      yield call(postMessage, { method: 'resetUserId', messageData: [] })
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'stopSession', e))
    }
  }

  return {
    createABTest,
    logEvent,
    logPageView,
    logGoal,
    initUserSession,
    postMessage,
    startSession,
    stopSession
  }
}
