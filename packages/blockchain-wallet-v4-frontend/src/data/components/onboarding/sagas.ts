import { delay, put, take } from 'redux-saga/effects'

import { actions, actionTypes } from 'data'

export const logLocation = 'components/onboarding/sagas'

export default () => {
  const airdropClaimSubmitClicked = function* ({ payload }) {
    // TODO: REFACTOR TO USE claimCampaignClicked
    const { campaign } = payload
    try {
      yield put(actions.form.startSubmit('airdropClaim'))
      yield put(actions.modules.profile.setCampaign({ name: campaign }))
      yield put(actions.components.identityVerification.registerUserCampaign(false))
      // Buffer for tagging user
      yield delay(3000)
      yield put(actions.modules.profile.fetchUser())
      yield take(actionTypes.modules.profile.FETCH_USER_DATA_SUCCESS)
      yield put(actions.form.stopSubmit('airdropClaim'))
      yield put(actions.modals.closeAllModals())
      yield put(
        actions.modals.showModal('AIRDROP_SUCCESS_MODAL', {
          origin: 'AirdropClaimGoal'
        })
      )
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'airdropClaimSubmitClicked', e))
    }
  }

  const swapGetStartedSubmitClicked = function* () {
    try {
      yield put(actions.preferences.hideKycGetStarted())
      yield put(actions.modals.closeModal())
      yield put(
        actions.components.identityVerification.verifyIdentity({
          needMoreInfo: false,
          origin: 'Swap',
          tier: 1
        })
      )
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'swapGetStartedSubmitClicked', e))
    }
  }

  const upgradeForAirdropSubmitClicked = function* ({ payload }) {
    const { campaign } = payload
    try {
      yield put(actions.preferences.hideUpgradeForAirdropModal())
      yield put(actions.modals.closeModal())
      yield put(actions.modules.profile.setCampaign({ name: campaign }))
      yield put(actions.components.identityVerification.createRegisterUserCampaign())
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'upgradeForAirdropSubmitClicked', e))
    }
  }

  return {
    airdropClaimSubmitClicked,
    swapGetStartedSubmitClicked,
    upgradeForAirdropSubmitClicked
  }
}
