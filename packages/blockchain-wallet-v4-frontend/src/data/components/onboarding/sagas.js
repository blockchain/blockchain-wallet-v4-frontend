import { actions, actionTypes, model } from 'data'
import { delay, put, take } from 'redux-saga/effects'

const { GENERAL_EVENTS } = model.analytics

export const logLocation = 'components/onboarding/sagas'

export default () => {
  const airdropClaimSubmitClicked = function * ({ payload }) {
    // TODO: REFACTOR TO USE claimCampaignClicked
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

  const takeWalletTourClicked = function * () {
    try {
      yield put(actions.modals.closeModal())
      yield put(actions.components.onboarding.setWalletTourVisibility(true))
      yield put(actions.core.kvStore.whatsNew.setHasSkippedWalletTour(false))
      yield put(actions.analytics.logEvent(GENERAL_EVENTS.WALLET_INTRO_STARTED))
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
    swapGetStartedSubmitClicked,
    takeWalletTourClicked,
    upgradeForAirdropSubmitClicked
  }
}
