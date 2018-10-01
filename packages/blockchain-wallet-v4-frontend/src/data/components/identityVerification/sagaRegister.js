import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, coreSagas }) => {
  const {
    verifyIdentity,
    initializeStep,
    updateSmsStep,
    updateSmsNumber,
    verifySmsNumber,
    resendSmsCode,
    savePersonalData,
    selectAddress,
    fetchSupportedCountries,
    fetchPossibleAddresses
  } = sagas({ api, coreSagas })

  return function*() {
    yield takeLatest(AT.VERIFY_IDENTITY, verifyIdentity)
    yield takeLatest(AT.INITIALIZE_STEP, initializeStep)
    yield takeLatest(AT.UPDATE_SMS_STEP, updateSmsStep)
    yield takeLatest(AT.UPDATE_SMS_NUMBER, updateSmsNumber)
    yield takeLatest(AT.VERIFY_SMS_NUMBER, verifySmsNumber)
    yield takeLatest(AT.RESEND_SMS_CODE, resendSmsCode)
    yield takeLatest(AT.SAVE_PERSONAL_DATA, savePersonalData)
    yield takeLatest(AT.FETCH_SUPPORTED_COUNTRIES, fetchSupportedCountries)
    yield takeLatest(AT.FETCH_POSSIBLE_ADDRESSES, fetchPossibleAddresses)
    yield takeLatest(AT.SELECT_ADDRESS, selectAddress)
  }
}
