import { put, delay, take } from 'redux-saga/effects'
import { actions, actionTypes, model } from 'data'

import * as C from '/services/AlertService'
const { GENERAL_EVENTS } = model.analytics

export const logLocation = 'components/onboarding/sagas'

export default () => {
  const airdropClaimSubmitClicked = function * ({ payload }) {
    const { campaign } = payload
    try {
      yield put(actions.form.startSubmit('airdropClaim'))
      yield put(actions.modules.profile.setCampaign({ name: campaign }))
      yield put(actions.components.identityVerification.registerUserCampaign())
      // Buffer for tagging user
      yield delay(3000)
      yield put(actions.modules.profile.fetchUser())
      yield take(actionTypes.modules.profile.FETCH_USER_DATA_SUCCESS)
      yield put(actions.form.stopSubmit('airdropClaim'))
      yield put(actions.modals.closeAllModals())
      yield put(actions.modals.showModal('AirdropSuccess'))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(
          logLocation,
          'airdropClaimSubmitClicked',
          e
        )
      )
    }
  }

  const coinifyUpgradeSubmitClicked = function * ({ payload }) {
    const { campaign } = payload
    try {
      yield put(actions.modals.closeModal())
      yield put(actions.modules.profile.setCampaign({ name: campaign }))
      yield put(
        actions.components.identityVerification.createRegisterUserCampaign()
      )
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(
          logLocation,
          'coinifyUpgradeSubmitClicked',
          e
        )
      )
    }
  }

  const swapGetStartedSubmitClicked = function * () {
    try {
      yield put(actions.preferences.hideKycGetStarted())
      yield put(actions.modals.closeModal())
      yield put(actions.components.identityVerification.verifyIdentity())
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(
          logLocation,
          'swapGetStartedSubmitClicked',
          e
        )
      )
    }
  }

  const skipWalletTourClicked = function * (action) {
    try {
      yield put(
        actions.alerts.displayInfo(C.SKIP_WALLET_TOUR_SUCCESS, {
          startTour: action.payload.startTourCallback
        })
      )
      yield put(actions.core.kvStore.whatsNew.setHasSkippedWalletTour(true))
      yield put(actions.analytics.logEvent(GENERAL_EVENTS.SKIP_WALLET_TOUR))
      yield put(actions.modals.closeModal())
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'skipWalletTourClicked', e)
      )
    }
  }

  const takeWalletTourClicked = function * () {
    try {
      yield put(actions.modals.closeModal())
      yield put(actions.components.onboarding.setWalletTourVisibility(true))
      yield put(actions.core.kvStore.whatsNew.setHasSkippedWalletTour(false))
      yield put(actions.analytics.logEvent(GENERAL_EVENTS.TAKE_WALLET_TOUR))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'takeWalletTourClicked', e)
      )
    }
  }

  const upgradeForAirdropSubmitClicked = function * ({ payload }) {
    const { campaign } = payload
    try {
      yield put(actions.preferences.hideUpgradeForAirdropModal())
      yield put(actions.modals.closeModal())
      yield put(actions.modules.profile.setCampaign({ name: campaign }))
      yield put(
        actions.components.identityVerification.createRegisterUserCampaign()
      )
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(
          logLocation,
          'upgradeForAirdropSubmitClicked',
          e
        )
      )
    }
  }

  return {
    airdropClaimSubmitClicked,
    coinifyUpgradeSubmitClicked,
    skipWalletTourClicked,
    swapGetStartedSubmitClicked,
    takeWalletTourClicked,
    upgradeForAirdropSubmitClicked
  }
}
