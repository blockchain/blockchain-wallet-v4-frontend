import { put } from 'redux-saga/effects'

import * as actions from '../../actions'

export const logLocation = 'components/swapGetStarted/sagas'

export default () => {
  const swapGetStartedSubmitClicked = function*() {
    try {
      yield put(actions.preferences.hideKycGetStarted())
      // Close modal
      yield put(actions.modals.closeModal())
      // Trigger KYC Journey
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

  return {
    swapGetStartedSubmitClicked
  }
}
