import { takeLatest } from 'redux-saga/effects'

import sagas from './sagas'
import { actions } from './slice'

export default ({ api, coreSagas, networks }) => {
  const identityVerificationSagas = sagas({ api, coreSagas, networks })

  return function* identityVerificationSaga() {
    yield takeLatest(actions.verifyIdentity.type, identityVerificationSagas.verifyIdentity)
    yield takeLatest(
      actions.initializeVerification.type,
      identityVerificationSagas.initializeVerification
    )
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

    yield takeLatest(actions.fetchExtraKYC.type, identityVerificationSagas.fetchExtraKYC)
    yield takeLatest(
      actions.saveKYCExtraQuestions.type,
      identityVerificationSagas.saveKYCExtraQuestions
    )
    yield takeLatest(actions.saveUserInfoData.type, identityVerificationSagas.saveUserInfoData)
    yield takeLatest(actions.fetchUserAddress.type, identityVerificationSagas.fetchUserAddress)
    yield takeLatest(actions.checkIsNameValid.type, identityVerificationSagas.checkIsNameValid)
    yield takeLatest(
      actions.retrieveUserAddress.type,
      identityVerificationSagas.retrieveUserAddress
    )
    yield takeLatest(
      actions.saveUserResidentialData.type,
      identityVerificationSagas.saveUserResidentialData
    )
  }
}
