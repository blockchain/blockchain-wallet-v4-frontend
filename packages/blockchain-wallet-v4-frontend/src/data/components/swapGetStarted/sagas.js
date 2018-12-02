import { put } from 'redux-saga/effects'

import * as actions from '../../actions'

export const logLocation = 'components/swapGetStarted/sagas'

export default ({ coreSagas }) => {
  const swapGetStartedInitialized = function*() {
    try {
      yield put(actions.preferences.hideKycGetStarted())
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

  const swapGetStartedSubmitClicked = function*() {
    try {
      // Trigger KYC Journey
      yield put(actions.components.identityVerification.verifyIdentity())
      // Close modal
      yield put(actions.modals.closeModal())
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
    swapGetStartedInitialized,
    swapGetStartedSubmitClicked
  }
}
