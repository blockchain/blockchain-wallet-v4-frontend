import { takeLatest } from 'redux-saga/effects'

import sagas from './sagas'
import { actions } from './slice'

export default ({ api, coreSagas }) => {
  const identityVerificationSagas = sagas({ api, coreSagas })

  return function* identityVerificationSaga() {
    yield takeLatest(actions.verifyIdentity.type, identityVerificationSagas.verifyIdentity)
    yield takeLatest(
      actions.initializeVerification.type,
      identityVerificationSagas.initializeVerification
    )
    yield takeLatest(actions.updateSmsStep.type, identityVerificationSagas.updateSmsStep)
    yield takeLatest(actions.updateSmsNumber.type, identityVerificationSagas.updateSmsNumber)
    yield takeLatest(actions.verifySmsNumber.type, identityVerificationSagas.verifySmsNumber)
    yield takeLatest(actions.resendSmsCode.type, identityVerificationSagas.resendSmsCode)
    yield takeLatest(
      actions.fetchSupportedCountries.type,
      identityVerificationSagas.fetchSupportedCountries
    )
    yield takeLatest(
      actions.fetchSupportedDocuments.type,
      identityVerificationSagas.fetchSupportedDocuments
    )
    yield takeLatest(actions.fetchStates.type, identityVerificationSagas.fetchStates)
    yield takeLatest(
      actions.registerUserCampaign.type,
      identityVerificationSagas.registerUserCampaign
    )
    yield takeLatest(
      actions.createRegisterUserCampaign.type,
      identityVerificationSagas.createRegisterUserCampaign
    )
    yield takeLatest(
      actions.claimCampaignClicked.type,
      identityVerificationSagas.claimCampaignClicked
    )
    yield takeLatest(actions.goToPrevStep.type, identityVerificationSagas.goToPrevStep)
    yield takeLatest(actions.goToNextStep.type, identityVerificationSagas.goToNextStep)
    yield takeLatest(actions.checkKycFlow.type, identityVerificationSagas.checkKycFlow)
    yield takeLatest(actions.sendDeepLink.type, identityVerificationSagas.sendDeepLink)
    yield takeLatest(actions.updateEmail.type, identityVerificationSagas.updateEmail)
    yield takeLatest(
      actions.sendEmailVerification.type,
      identityVerificationSagas.sendEmailVerification
    )
    yield takeLatest(
      actions.saveInfoAndResidentialData.type,
      identityVerificationSagas.saveInfoAndResidentialData
    )
    yield takeLatest(actions.fetchExtraKYC.type, identityVerificationSagas.fetchExtraKYC)
    yield takeLatest(
      actions.saveKYCExtraQuestions.type,
      identityVerificationSagas.saveKYCExtraQuestions
    )
  }
}
