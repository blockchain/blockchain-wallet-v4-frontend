import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default () => {
  const onboardingSagas = sagas()

  return function * swapGetStartedSaga () {
    yield takeLatest(
      AT.SWAP_GET_STARTED_SUBMIT_CLICKED,
      onboardingSagas.swapGetStartedSubmitClicked
    )
    yield takeLatest(
      AT.AIRDROP_CLAIM_SUBMIT_CLICKED,
      onboardingSagas.airdropClaimSubmitClicked
    )
    yield takeLatest(
      AT.AIRDROP_REMINDER_SUBMIT_CLICKED,
      onboardingSagas.airdropReminderSubmitClicked
    )
    yield takeLatest(
      AT.UPGRADE_FOR_AIRDROP_SUBMIT_CLICKED,
      onboardingSagas.upgradeForAirdropSubmitClicked
    )
    yield takeLatest(
      AT.COINIFY_UPGRADE_SUBMIT_CLICKED,
      onboardingSagas.coinifyUpgradeSubmitClicked
    )
  }
}
