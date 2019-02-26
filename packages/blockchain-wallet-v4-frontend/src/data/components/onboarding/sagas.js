import { put } from 'redux-saga/effects'

import * as actions from '../../actions'

export const logLocation = 'components/onboarding/sagas'

export default () => {
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

  return {
    airdropReminderSubmitClicked,
    swapGetStartedSubmitClicked
  }
}
