import { call, delay, put, select, take } from 'redux-saga/effects'
import { toLower, map, prop } from 'ramda'
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
    const defaultHDWallet = yield select(
      selectors.core.wallet.getDefaultHDWallet
    )
    const userId = yield call(waitForUserId)
    if (userId) return userId
    const { seedHex } = defaultHDWallet
    const mnemonic = BIP39.entropyToMnemonic(seedHex)
    const masterhex = BIP39.mnemonicToSeed(mnemonic)
    const masterHDNode = Bitcoin.HDNode.fromSeedBuffer(masterhex)
    let hash = crypto.sha256('info.blockchain.matomo')
    let purpose = hash.slice(0, 4).readUInt32BE(0) & 0x7fffffff
    return masterHDNode.deriveHardened(purpose).getAddress()
  }

  const initUserSession = function * () {
    try {
      const guid = yield call(generateUniqueUserID)
      yield call(startSession, { payload: { guid } })
      yield call(logPageView, { payload: { route: '/home' } })
      // wait 10 seconds to ensure required user data is loaded
      yield delay(10000)
      // log currency display preference
      const isCryptoDisplayed = yield select(
        selectors.preferences.getCoinDisplayed
      )
      yield call(postMessage, {
        method: 'setCustomDimension',
        messageData: {
          dimensionId: CUSTOM_DIMENSIONS.CURRENCY_DISPLAY_PREFERENCE,
          dimensionValue: isCryptoDisplayed ? 'crypto' : 'fiat'
        }
      })
      // log current user kyc tier
      const currentUserTiers = (yield select(
        selectors.modules.profile.getUserTiers
      )).getOrElse({ current: 0 })
      yield call(postMessage, {
        method: 'setCustomDimension',
        messageData: {
          dimensionId: CUSTOM_DIMENSIONS.KYC_TIER,
          dimensionValue: prop('current', currentUserTiers)
        }
      })
      // TODO: log has crypto flags
      // ETH :: selectors.core.data.eth.getBalance
      // PAX :: selectors.core.data.eth.getErc20Balance(state, 'pax')
      // XLM :: selectors.core.data.xlm.getTotalBalance
      // BTC ::
      // BCH ::
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
