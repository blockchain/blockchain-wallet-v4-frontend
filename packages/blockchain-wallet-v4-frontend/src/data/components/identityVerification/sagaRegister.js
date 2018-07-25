import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, coreSagas }) => {
  const {
    updatePersonalStep,
    updateEmail,
    verifyEmail,
    resendEmailCode,
    updateSmsNumber,
    verifySmsNumber,
    resendSmsCode
  } = sagas({ api, coreSagas })

  return function*() {
    yield takeLatest(AT.UPDATE_PERSONAL_STEP, updatePersonalStep)
    yield takeLatest(AT.UPDATE_EMAIL, updateEmail)
    yield takeLatest(AT.VERIFY_EMAIL, verifyEmail)
    yield takeLatest(AT.RESEND_EMAIL_CODE, resendEmailCode)
    yield takeLatest(AT.UPDATE_SMS_NUMBER, updateSmsNumber)
    yield takeLatest(AT.VERIFY_SMS_NUMBER, verifySmsNumber)
    yield takeLatest(AT.RESEND_SMS_CODE, resendSmsCode)
  }
}
