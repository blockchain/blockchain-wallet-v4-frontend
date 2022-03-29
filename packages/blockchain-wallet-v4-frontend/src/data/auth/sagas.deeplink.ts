import { call, put, select } from 'redux-saga/effects'

import { actions, selectors } from 'data'
import profileSagas from 'data/modules/profile/sagas'
import { ModalName } from 'data/types'

import { AppDeeplinkPayload, KycDeeplinkParams, LogLevelDeeplinkParams } from './types.deeplinks'

const origin = 'Deeplink'

export default ({ api, coreSagas, networks }) => {
  const { waitForUserData } = profileSagas({
    api,
    coreSagas,
    networks
  })

  // maps routes to specific actions for the deeplink
  // routes will start with either /app (new format) or /open (legacy goals format)
  const deeplinkExecutionMap = function* (deeplinkData: AppDeeplinkPayload) {
    const { params, route } = deeplinkData
    switch (route) {
      case '/open/simple-buy':
        break
      case '/open/kyc':
        // get desired tier, defaulting to 2
        const { tier = 2 } = params as KycDeeplinkParams
        yield call(waitForUserData)
        const { current } = (yield select(selectors.modules.profile.getUserTiers)).getOrElse({
          current: 0
        }) || { current: 0 }
        // if current tier >= desired tier from deeplink, exit
        if (current >= Number(tier)) return
        yield put(
          actions.components.identityVerification.verifyIdentity({
            needMoreInfo: false,
            origin,
            tier
          })
        )
        break
      case '/open/rewards' || '/open/interest':
        yield put(actions.router.push('/rewards'))
        break
      case '/open/log-level':
        const { level } = params as LogLevelDeeplinkParams
        // @ts-ignore
        window.logLevel = level
        yield put(actions.logs.setLogLevel(level))
        break
      case '/open/swap':
        yield put(actions.modals.showModal(ModalName.SWAP_MODAL, { origin }))
        break
      default:
        break
    }
  }

  // determines if there is a deeplink stored and if so, calls to execute
  const checkForAndRouteDeeplinks = function* () {
    const deeplinkData = (yield select(selectors.auth.getDeeplinkData)) as AppDeeplinkPayload
    if (deeplinkData) {
      yield call(deeplinkExecutionMap, deeplinkData)
    }
  }

  // most deeplinks require the user to login first. some dont, check for those and redirect to signup if necessary
  const determinePreAuthRouteForDeeplink = function* () {
    // const deeplinkData = (yield select(selectors.auth.getDeeplinkData)) as AppDeeplinkPayload
    yield put(actions.router.push('/login'))
  }

  return {
    checkForAndRouteDeeplinks,
    determinePreAuthRouteForDeeplink
  }
}
