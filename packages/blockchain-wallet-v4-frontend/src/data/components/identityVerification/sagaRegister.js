import { takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, coreSagas }) => {
  const identityVerificationSagas = sagas({ api, coreSagas })

  return function * identityVerificationSaga() {
    yield takeLatest(
      AT.VERIFY_IDENTITY,
      identityVerificationSagas.verifyIdentity
    )
    yield takeLatest(
      AT.INITIALIZE_VERIFICATION,
      identityVerificationSagas.initializeVerification
    )
    yield takeLatest(
      AT.UPDATE_SMS_STEP,
      identityVerificationSagas.updateSmsStep
    )
    yield takeLatest(
      AT.UPDATE_SMS_NUMBER,
      identityVerificationSagas.updateSmsNumber
    )
    yield takeLatest(
      AT.VERIFY_SMS_NUMBER,
      identityVerificationSagas.verifySmsNumber
    )
    yield takeLatest(
      AT.RESEND_SMS_CODE,
      identityVerificationSagas.resendSmsCode
    )
    yield takeLatest(
      AT.FETCH_SUPPORTED_COUNTRIES,
      identityVerificationSagas.fetchSupportedCountries
    )
    yield takeLatest(
      AT.FETCH_SUPPORTED_DOCUMENTS,
      identityVerificationSagas.fetchSupportedDocuments
    )
    yield takeLatest(AT.FETCH_STATES, identityVerificationSagas.fetchStates)
    yield takeLatest(
      AT.REGISTER_USER_CAMPAIGN,
      identityVerificationSagas.registerUserCampaign
    )
    yield takeLatest(
      AT.CREATE_REGISTER_USER_CAMPAIGN,
      identityVerificationSagas.createRegisterUserCampaign
    )
    yield takeLatest(
      AT.CLAIM_CAMPAIGN_CLICKED,
      identityVerificationSagas.claimCampaignClicked
    )
    yield takeLatest(AT.GO_TO_PREV_STEP, identityVerificationSagas.goToPrevStep)
    yield takeLatest(AT.GO_TO_NEXT_STEP, identityVerificationSagas.goToNextStep)
    yield takeLatest(AT.CHECK_KYC_FLOW, identityVerificationSagas.checkKycFlow)
    yield takeLatest(AT.SEND_DEEP_LINK, identityVerificationSagas.sendDeeplink)
    yield takeLatest(AT.UPDATE_EMAIL, identityVerificationSagas.updateEmail)
    yield takeLatest(
      AT.SEND_EMAIL_VERIFICATION,
      identityVerificationSagas.sendEmailVerification
    )
    yield takeLatest(
      AT.SAVE_INFO_AND_RESIDENTIAL_DATA,
      identityVerificationSagas.saveInfoAndResidentialData
    )
  }
}
