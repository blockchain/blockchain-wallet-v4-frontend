import { END, eventChannel } from 'redux-saga'
import { call, put, select, take } from 'redux-saga/effects'
import { hasPath } from 'ramda'
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

import { LOGIN_FORM } from './model'

// TODO: remove all console logs after dev debugging phase

let messageListener

// global function for mobile clients to call to pass message
// this must be exposed on window
window.receiveMessageFromMobile = (message) => {
  // eslint-disable-next-line
  console.log('SSO mobile message: ', message)
  messageListener(message)
}

// returns eventChannel to calling generator function that will in turn propagate (emit) future message from mobile
// this function must be always be called first before we are able to detect messages since it will expose the
// emitter on messageListener so receiveMessageFromMobile func can emit the actual message
const pollForMessageFromMobile = () => {
  // eslint-disable-next-line
  console.log('SSO message polling started')
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
  // messages must be passed as strings to mobile clients
  const messageStringified = JSON.stringify(message)
  console.log('sendMessageToMobile start')
  switch (true) {
    // ios
    case platform === PlatformTypes.IOS && window.webkit:
      console.log('sendMessageToMobile ios detected')
      try {
        console.log(
          'sendMessageToMobile connectionStatusHandler exists?: ',
          hasPath(['webkit', 'messageHandlers', 'connectionStatusHandler'], window)
        )
        console.log(
          'sendMessageToMobile credentialsHandler exists?: ',
          hasPath(['webkit', 'messageHandlers', 'credentialsHandler'], window)
        )
        // ios has two different message handlers
        if ((message as MobileAuthConnectedMessage).status) {
          console.log('sendMessageToMobile inside connectionStatusHandler')
          window.webkit.messageHandlers.connectionStatusHandler.postMessage(messageStringified)
        } else {
          window.webkit.messageHandlers.credentialsHandler.postMessage(messageStringified)
        }
      } catch (e) {
        throw new Error('Failed to send message to iOS')
      }
      break
    // android
    case platform === PlatformTypes.ANDROID && window.BCAndroidSSI:
      console.log('sendMessageToMobile android detected')
      try {
        console.log(
          'sendMessageToMobile postMessage exists?: ',
          hasPath(['BCAndroidSSI', 'postMessage'], window)
        )
        window.BCAndroidSSI.postMessage(messageStringified)
      } catch (e) {
        throw new Error('Failed to send message to Android')
      }
      break
    default:
      console.log('sendMessageToMobile no mobile window detected')
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
    console.log('calling sendMessageToMobile')
    // let mobile know webview has finished loading
    sendMessageToMobile(platform, { status: 'connected' })
    // eslint-disable-next-line
    console.log('SSO sent connected message to mobile')
    // wait for auth payload message from mobile
    while (true) {
      authPayloadFromMobile = yield take(mobileMessageChannel)
      if (authPayloadFromMobile) {
        // eslint-disable-next-line
        console.log('SSO auth payload message:', authPayloadFromMobile)
        break
      }
    }
  } catch (e) {
    mobileMessageChannel.end()
  }
  // TEST DATA
  // authPayloadFromMobile = {
  //   exchange: {
  //     email: 'leora+235+1002@blockchain.com',
  //     user_id: 'ed005bec-1ced-4fc0-95ea-0d6f75ecae10'
  //   },
  //   wallet: {
  //     guid: '543e134b-e022-4fd6-9185-700b5e90908a',
  //     email: 'leora+235+1002@blockchain.com',
  //     two_fa_type: 0,
  //     email_code:
  //       'G4XNGu7Pg5yI3qDTyMXTduTFdDZaT40MREr3/yYwwo6vC+aRfqeZqTZlMStgWmsg/9Qq5sLW6LtFS5k/7J+bT2nPs6v2YDz+ud666sodqmTwtsRfEGSVAyW1XX5EUG+tNpA8Jk90coxQtGUL94XV99Yt64W6i9rdDEeDn4UCUhP/KZ4w3iK/og7bLSNFqPIf',
  //     is_mobile_setup: false,
  //     has_cloud_backup: false,
  //     nabu: {
  //       user_id: '85d02fd0-c74d-4cc5-878e-a77bddb988a3',
  //       recovery_token: 'e728e8e6-a709-4768-bd51-b08b2796d853'
  //     }
  //   },
  //   user_type: 'EXCHANGE',
  //   upgradeable: null,
  //   mergeable: true,
  //   unified: null,
  //   product: 'EXCHANGE'
  // }

  // TODO: mobile will send us an encoded string version of the auth payload,
  //  need to parse before storing in redux

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
      yield put(actions.form.change(LOGIN_FORM, 'emailToken', walletData?.email_code))
      yield put(actions.form.change(LOGIN_FORM, 'guid', walletData?.guid))
      yield put(actions.form.change(LOGIN_FORM, 'email', walletData?.email))
      yield put(
        actions.auth.setAccountUnificationFlowType(AccountUnificationFlows.MOBILE_WALLET_MERGE)
      )
      yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.ENTER_PASSWORD_WALLET))
      break
    // mobile exchange merge
    case product === ProductAuthOptions.EXCHANGE && mergeable:
      yield put(actions.form.change(LOGIN_FORM, 'email', exchangeData?.email))
      yield put(actions.form.change(LOGIN_FORM, 'emailToken', walletData?.email_code))
      yield put(actions.form.change(LOGIN_FORM, 'guid', walletData?.guid))
      yield put(actions.form.change(LOGIN_FORM, 'email', walletData?.email))
      yield put(
        actions.auth.setAccountUnificationFlowType(AccountUnificationFlows.MOBILE_EXCHANGE_MERGE)
      )
      yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.ENTER_PASSWORD_EXCHANGE))
      break
    // mobile exchange upgrade
    case product === ProductAuthOptions.EXCHANGE && upgradeable:
      yield put(actions.form.change(LOGIN_FORM, 'email', exchangeData?.email))
      yield put(
        actions.auth.setAccountUnificationFlowType(AccountUnificationFlows.MOBILE_EXCHANGE_UPGRADE)
      )
      yield put(actions.form.change(LOGIN_FORM, 'step', LoginSteps.ENTER_PASSWORD_EXCHANGE))
      break
    // no sso flow require, continue to auth
    default:
      break
  }
}
