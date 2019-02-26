import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default () => {
  const onboardingSagas = sagas()

  return function* swapGetStartedSaga () {
    yield takeLatest(
      AT.SWAP_GET_STARTED_SUBMIT_CLICK,
      onboardingSagas.swapGetStartedSubmitClicked
    )
    yield takeLatest(
      AT.AIRDROP_REMINDER_SUBMIT_CLICK,
      onboardingSagas.airdropReminderSubmitClicked
    )
  }
}
