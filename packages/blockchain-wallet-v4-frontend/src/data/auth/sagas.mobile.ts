import { END, eventChannel } from 'redux-saga'
import { call, put, select, take } from 'redux-saga/effects'

import { actions, selectors } from 'data'
import {
  AccountUnificationFlows,
  LoginSteps,
  MobileAuthConnectedMessage,
  MobileAuthExchangeMessage,
  MobileAuthWalletMergeMessage,
  PlatformTypes,
  ProductAuthOptions,
  WalletDataFromMagicLink
} from 'data/types'

let messageListener

// global function for mobile clients to call to pass message
// this must be exposed on window
window.receiveMessageFromMobile = (message) => {
  messageListener(message)
}

// returns eventChannel to calling generator function that will in turn propagate (emit) future message from mobile
// this function must be always be called first before we are able to detect messages since it will expose the
// emitter on messageListener so receiveMessageFromMobile func can emit the actual message
const pollForMessageFromMobile = () => {
  return eventChannel((emitter) => {
    messageListener = emitter
    return () => emitter(END)
  })
}

// sends messages to mobile clients based on platform
const sendMessageToMobile = (
  platform: PlatformTypes,
  message: MobileAuthConnectedMessage | MobileAuthWalletMergeMessage | MobileAuthExchangeMessage
) => {
  switch (true) {
    // ios
    case platform === PlatformTypes.IOS && window.webkit:
      try {
        window.webkit.messageHandlers.sessionHandler.postMessage(message)
      } catch (e) {
        throw new Error('Failed to send message to iOS')
      }
      break
    // android
    case platform === PlatformTypes.ANDROID && window.Android:
      try {
        window.Android.postMessage(message)
      } catch (e) {
        throw new Error('Failed to send message to Android')
      }
      break
    default:
      throw new Error('Unable to send message. Missing platform type or window function')
  }
}

export const initMobileAuthFlow = function* () {
  let mobileMessageChannel
  let authPayloadFromMobile

  // get auth metadata about product and platform stored in initial auth saga
  const { platform, product } = yield select(selectors.auth.getProductAuthMetadata)

  // wait for auth payload message from mobile
  try {
    // start event listener for message from mobile
    mobileMessageChannel = yield call(pollForMessageFromMobile)
    // let mobile know webview has finished loading
    sendMessageToMobile(platform, { status: 'connected' })
    // wait for auth payload message from mobile
    while (true) {
      authPayloadFromMobile = yield take(mobileMessageChannel)
      if (authPayloadFromMobile) break
    }
  } catch (e) {
    mobileMessageChannel.end()
  }

  // store payload to redux state so we can use later
  yield put(actions.auth.setMagicLinkInfo(authPayloadFromMobile))
  const {
    exchange: exchangeData,
    mergeable,
    upgradeable,
    wallet: walletData
  }: WalletDataFromMagicLink = authPayloadFromMobile

  // determine correct flow then setup forms and next step
  switch (true) {
    // mobile wallet merge
    case product === ProductAuthOptions.WALLET && mergeable:
      yield put(actions.form.change('login', 'emailToken', walletData?.email_code))
      yield put(actions.form.change('login', 'guid', walletData?.guid))
      yield put(actions.form.change('login', 'email', walletData?.email))
      yield put(
        actions.auth.setAccountUnificationFlowType(AccountUnificationFlows.MOBILE_WALLET_MERGE)
      )
      yield put(actions.form.change('login', 'step', LoginSteps.ENTER_PASSWORD_WALLET))
      break
    // mobile exchange merge
    case product === ProductAuthOptions.EXCHANGE && mergeable:
      yield put(actions.form.change('login', 'email', exchangeData?.email))
      yield put(actions.form.change('login', 'emailToken', walletData?.email_code))
      yield put(actions.form.change('login', 'guid', walletData?.guid))
      yield put(actions.form.change('login', 'email', walletData?.email))
      yield put(
        actions.auth.setAccountUnificationFlowType(AccountUnificationFlows.MOBILE_EXCHANGE_MERGE)
      )
      yield put(actions.form.change('login', 'step', LoginSteps.ENTER_PASSWORD_EXCHANGE))
      break
    // mobile exchange upgrade
    case product === ProductAuthOptions.EXCHANGE && upgradeable:
      yield put(actions.form.change('login', 'email', exchangeData?.email))
      yield put(
        actions.auth.setAccountUnificationFlowType(AccountUnificationFlows.MOBILE_EXCHANGE_UPGRADE)
      )
      yield put(actions.form.change('login', 'step', LoginSteps.ENTER_PASSWORD_EXCHANGE))
      break
    // no sso flow require, continue to auth
    default:
      break
  }
}
