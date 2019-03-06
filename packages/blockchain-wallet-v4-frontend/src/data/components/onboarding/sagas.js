import { put, take } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { actions, actionTypes } from 'data'

export const logLocation = 'components/onboarding/sagas'

export default () => {
  const airdropClaimSubmitClicked = function*({ payload }) {
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
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(
          logLocation,
          'airdropReminderSubmitClicked',
          e
        )
      )
    }
  }

  const airdropReminderSubmitClicked = function*({ payload }) {
    const { campaign } = payload
    try {
      yield put(actions.preferences.hideAirdropReminderModal())
      yield put(actions.modals.closeModal())
      yield put(actions.modules.profile.setCampaign({ name: campaign }))
      yield put(
        actions.components.identityVerification.createRegisterUserCampaign()
      )
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(
          logLocation,
          'airdropReminderSubmitClicked',
          e
        )
      )
    }
  }

  const swapGetStartedSubmitClicked = function*() {
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

  const upgradeForAirdropSubmitClicked = function*({ payload }) {
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

  const coinifyUpgradeSubmitClicked = function*({ payload }) {
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

  return {
    airdropClaimSubmitClicked,
    airdropReminderSubmitClicked,
    coinifyUpgradeSubmitClicked,
    swapGetStartedSubmitClicked,
    upgradeForAirdropSubmitClicked
  }
}
