import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, coreSagas }) => {
  const exchange = sagas({ api, coreSagas })

  return function*() {
    yield takeLatest(AT.VERIFY_IDENTITY, exchange.verifyIdentity)
    yield takeLatest(AT.INITIALIZE_STEP, exchange.initializeStep)
    yield takeLatest(AT.UPDATE_SMS_STEP, exchange.updateSmsStep)
    yield takeLatest(AT.UPDATE_SMS_NUMBER, exchange.updateSmsNumber)
    yield takeLatest(AT.VERIFY_SMS_NUMBER, exchange.verifySmsNumber)
    yield takeLatest(AT.RESEND_SMS_CODE, exchange.resendSmsCode)
    yield takeLatest(AT.SAVE_PERSONAL_DATA, exchange.savePersonalData)
    yield takeLatest(
      AT.FETCH_SUPPORTED_COUNTRIES,
      exchange.fetchSupportedCountries
    )
    yield takeLatest(
      AT.FETCH_SUPPORTED_DOCUMENTS,
      exchange.fetchSupportedDocuments
    )
    yield takeLatest(AT.FETCH_STATES, exchange.fetchStates)
    yield takeLatest(
      AT.FETCH_POSSIBLE_ADDRESSES,
      exchange.fetchPossibleAddresses
    )
    yield takeLatest(AT.SELECT_ADDRESS, exchange.selectAddress)
    yield takeLatest(
      AT.CREATE_REGISTER_USER_CAMPAIGN,
      exchange.createRegisterUserCampaign
    )
    yield takeLatest(AT.CHECK_KYC_FLOW, exchange.checkKycFlow)
    yield takeLatest(AT.RESEND_DEEP_LINK, exchange.resendDeeplink)
  }
}
