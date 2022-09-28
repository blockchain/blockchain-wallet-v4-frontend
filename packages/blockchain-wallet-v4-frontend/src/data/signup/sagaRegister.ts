import { takeLatest } from 'redux-saga/effects'

import sagas from './sagas'
import { actions } from './slice'

export default ({ api, coreSagas, networks }) => {
  const signupSagas = sagas({ api, coreSagas, networks })

  return function* signupSaga() {
    yield takeLatest(actions.approveAccountReset, signupSagas.approveAccountReset)
    yield takeLatest(actions.initializeSignup.type, signupSagas.initializeSignUp)
    yield takeLatest(actions.pollForResetApproval, signupSagas.pollForResetApproval)
    yield takeLatest(actions.register.type, signupSagas.register)
    yield takeLatest(actions.resetAccount.type, signupSagas.resetAccount)
    yield takeLatest(actions.resetAccountV2.type, signupSagas.resetAccountV2)
    yield takeLatest(actions.restore.type, signupSagas.restore)
    yield takeLatest(actions.restoreFromMetadata.type, signupSagas.restoreFromMetadata)
    yield takeLatest(actions.triggerRecoverEmail, signupSagas.triggerRecoverEmail)
    yield takeLatest(
      actions.triggerSmsVerificationRecovery,
      signupSagas.triggerSmsVerificationRecovery
    )
    yield takeLatest(actions.verifyTwoFaForRecovery, signupSagas.verifyTwoFaForRecovery)
  }
}
