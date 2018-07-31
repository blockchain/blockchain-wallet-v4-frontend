import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api }) => {
  const {
    updatePersonalStep,
    updateEmail,
    verifyEmail,
    resendEmailCode,
    updateSmsNumber,
    verifySmsNumber,
    resendSmsCode,
    savePersonalData,
    saveAddress,
    selectAddress,
    fetchSupportedCountries,
    fetchPossibleAddresses
  } = sagas({ api })

  return function*() {
    yield takeLatest(AT.UPDATE_PERSONAL_STEP, updatePersonalStep)
    yield takeLatest(AT.UPDATE_EMAIL, updateEmail)
    yield takeLatest(AT.VERIFY_EMAIL, verifyEmail)
    yield takeLatest(AT.RESEND_EMAIL_CODE, resendEmailCode)
    yield takeLatest(AT.UPDATE_SMS_NUMBER, updateSmsNumber)
    yield takeLatest(AT.VERIFY_SMS_NUMBER, verifySmsNumber)
    yield takeLatest(AT.RESEND_SMS_CODE, resendSmsCode)
    yield takeLatest(AT.SAVE_PERSONAL_DATA, savePersonalData)
    yield takeLatest(AT.SAVE_ADDRESS, saveAddress)
    yield takeLatest(AT.FETCH_SUPPORTED_COUNTRIES, fetchSupportedCountries)
    yield takeLatest(AT.FETCH_POSSIBLE_ADDRESSES, fetchPossibleAddresses)
    yield takeLatest(AT.SELECT_ADDRESS, selectAddress)
  }
}
