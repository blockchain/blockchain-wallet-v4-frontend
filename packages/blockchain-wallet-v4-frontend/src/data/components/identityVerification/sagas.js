import { put, select } from 'redux-saga/effects'
import { actions, selectors } from 'data'

import * as A from './actions'
import {
  PERSONAL_STEPS,
  EMAIL_STEPS,
  SMS_STEPS,
  EMAIL_FORM,
  SMS_NUMBER_FORM
} from './model'

export const logLocation = 'components/identityVerification/sagas'

export default ({ api, coreSagas }) => {
  const derivePersonalStep = ({
    email,
    emailVerified,
    smsNumber,
    smsVerified
  }) => {
    if (!email || !emailVerified) return PERSONAL_STEPS.email
    if (!smsNumber || !smsVerified) return PERSONAL_STEPS.smsNumber
    return PERSONAL_STEPS.personal
  }

  const deriveEmailStep = ({ email, emailVerified }) => {
    if (email && !emailVerified) return EMAIL_STEPS.verify
    return EMAIL_STEPS.edit
  }

  const deriveSmsStep = ({ smsNumber, smsVerified }) => {
    if (smsNumber && !smsVerified) return SMS_STEPS.verify
    return SMS_STEPS.edit
  }

  const updatePersonalStep = function*(action) {
    const { email, emailVerified, smsNumber, smsVerified } = action.payload
    yield put(
      A.setPersonalStep(
        derivePersonalStep({ email, emailVerified, smsNumber, smsVerified })
      )
    )
    yield put(A.setEmailStep(deriveEmailStep({ email, emailVerified })))
    yield put(A.setSmsStep(deriveSmsStep({ smsNumber, smsVerified })))
  }

  const updateEmail = function*(args) {
    const { email } = yield select(selectors.form.getFormValues(EMAIL_FORM))
    yield put(A.setFormBusy(true))
    yield put(actions.modules.securityCenter.updateEmail(email))
    yield put(A.setEmailStep(EMAIL_STEPS.verify))
  }

  const verifyEmail = function*() {
    const { code } = yield select(selectors.form.getFormValues(EMAIL_FORM))
    yield put(A.setFormBusy(true))
    yield put(actions.modules.securityCenter.verifyEmailCode(code))
  }

  const resendEmailCode = function*() {
    const email = (yield select(selectors.core.settings.getEmail)).getOrElse('')
    yield put(actions.modules.securityCenter.sendConfirmationCodeEmail(email))
  }

  const updateSmsNumber = function*() {
    const { smsNumber } = yield select(
      selectors.form.getFormValues(SMS_NUMBER_FORM)
    )
    yield put(A.setFormBusy(true))
    yield put(actions.modules.settings.updateMobile(smsNumber))
    yield put(A.setSmsStep(SMS_STEPS.verify))
  }

  const verifySmsNumber = function*() {
    yield put(A.setFormBusy(true))
    const { code } = yield select(selectors.form.getFormValues(SMS_NUMBER_FORM))
    yield put(actions.modules.settings.verifyMobile(code))
  }

  const resendSmsCode = function*() {
    const smsNumber = (yield select(
      selectors.core.settings.getSmsNumber
    )).getOrElse('')
    yield put(actions.modules.settings.updateMobile(smsNumber))
  }

  return {
    updatePersonalStep,
    updateEmail,
    verifyEmail,
    updateSmsNumber,
    verifySmsNumber,
    resendEmailCode,
    resendSmsCode
  }
}
