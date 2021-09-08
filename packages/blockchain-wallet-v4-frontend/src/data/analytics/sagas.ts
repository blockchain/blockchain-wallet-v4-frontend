import { add, equals, map, not, propOr, reduce } from 'ramda'
import { call, delay, put, select } from 'redux-saga/effects'

import * as crypto from 'blockchain-wallet-v4/src/walletCrypto'
import { actions, selectors } from 'data'

import { CUSTOM_VARIABLES } from './model'

export const logLocation = 'analytics/sagas'
export default () => {
  const postMessage = function* (message, isFromRetry?) {
    try {
      const frame = document.getElementById('matomo-iframe')
      if (frame) {
        // @ts-ignore
        frame.contentWindow.postMessage(message, '*')
      } else if (!isFromRetry) {
        // ensures we only retry a request once
        // wait 4 seconds for iframe to fully load
        yield delay(4000)
        yield call(postMessage, message, true)
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'postMessage', e))
    }
  }

  const generateUniqueUserID = function* () {
    const guid = yield select(selectors.core.wallet.getGuid)
    const hash = crypto.sha256(guid).toString('base64')
    return hash
  }

  const startSession = function* (action) {
    try {
      const { guid } = action.payload
      yield call(postMessage, {
        messageData: [crypto.sha256(guid).toString('hex').slice(0, 15)],
        method: 'setUserId'
      })
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'startSession', e))
    }
  }

  const logPageView = function* (action) {
    try {
      const { route } = action.payload
      yield call(postMessage, {
        messageData: { route },
        method: 'logPageView'
      })
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'logPageView', e))
    }
  }

  const initUserSession = function* () {
    try {
      const guid = yield call(generateUniqueUserID)
      yield call(startSession, { payload: { guid } })
      yield call(logPageView, { payload: { route: '/home' } })
      // wait 10 seconds to ensure required user data is loaded
      yield delay(10000)
      // log current user kyc tier
      const currentUserTiers = (yield select(selectors.modules.profile.getUserTiers)).getOrElse({
        current: 0
      })
      yield call(postMessage, {
        messageData: {
          variableId: CUSTOM_VARIABLES.KYC_TIER.ID,
          variableName: CUSTOM_VARIABLES.KYC_TIER.NAME,
          variableScope: 'visit',
          variableValue: propOr(0, 'current', currentUserTiers)
        },
        method: 'setCustomVariable'
      })
      // log current user balance flags
      const state = yield select()
      const ethBalance = (yield select(selectors.core.data.eth.getBalance)).getOrElse(0)
      const xlmBalance = (yield select(selectors.core.data.xlm.getTotalBalance)).getOrElse(0)
      const btcContext = yield select(selectors.core.wallet.getSpendableContext)
      const btcBalance = reduce<number, number>(
        add,
        0,
        map(
          (address) => selectors.core.data.btc.getFinalBalance(state, address).getOrElse(0),
          btcContext
        )
      )
      const bchContext = yield select(selectors.core.kvStore.bch.getSpendableContext)
      const bchBalance = reduce<number, number>(
        add,
        0,
        map(
          (address) => selectors.core.data.bch.getFinalBalance(state, address).getOrElse(0),
          bchContext
        )
      )
      yield call(postMessage, {
        messageData: {
          variableId: CUSTOM_VARIABLES.CRYPTO_BALANCES.ID,
          variableName: CUSTOM_VARIABLES.CRYPTO_BALANCES.NAME,
          variableScope: 'visit',
          variableValue: JSON.stringify({
            BCH: not(equals(bchBalance, 0)),
            BTC: not(equals(btcBalance, 0)),
            ETH: not(equals(ethBalance, 0)),
            XLM: not(equals(xlmBalance, 0))
          })
        },
        method: 'setCustomVariable'
      })
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'initUserSession', e))
    }
  }

  const logEvent = function* (action) {
    try {
      const { event } = action.payload
      yield call(postMessage, {
        messageData: event,
        method: 'trackEvent'
      })
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'logEvent', e))
    }
  }

  const createABTest = function* (action) {
    try {
      const { test } = action.payload
      yield call(postMessage, {
        messageData: { name: test },
        method: 'AbTesting::create'
      })
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'logABTest', e))
    }
  }

  const logGoal = function* () {
    try {
      // TODO
      yield
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'logGoal', e))
    }
  }

  const stopSession = function* () {
    try {
      yield call(postMessage, { messageData: [], method: 'resetUserId' })
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'stopSession', e))
    }
  }

  return {
    createABTest,
    initUserSession,
    logEvent,
    logGoal,
    logPageView,
    postMessage,
    startSession,
    stopSession
  }
}
