import { takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default () => {
  const onboardingSagas = sagas()

  return function * swapGetStartedSaga() {
    yield takeLatest(
      // @ts-ignore
      AT.AIRDROP_CLAIM_SUBMIT_CLICKED,
      onboardingSagas.airdropClaimSubmitClicked
    )
    yield takeLatest(
      AT.SWAP_GET_STARTED_SUBMIT_CLICKED,
      onboardingSagas.swapGetStartedSubmitClicked
    )
    yield takeLatest(
      // @ts-ignore
      AT.UPGRADE_FOR_AIRDROP_SUBMIT_CLICKED,
      onboardingSagas.upgradeForAirdropSubmitClicked
    )
  }
}
