import { put, select, call } from 'redux-saga/effects'
import { isEmpty } from 'ramda'

import { callLatest } from 'utils/effects'
import { actions, selectors } from 'data'
import profileSagas from 'data/modules/profile/sagas'
import { Remote } from 'blockchain-wallet-v4/src'

import * as A from './actions'
import {
  STEPS,
  PERSONAL_STEPS,
  EMAIL_STEPS,
  SMS_STEPS,
  EMAIL_FORM,
  SMS_NUMBER_FORM,
  PERSONAL_FORM,
  ADDRESS_FORM
} from './model'

export const logLocation = 'components/identityVerification/sagas'

export const failedToFetchAddressesError = 'Invalid zipcode'
export const noCountryCodeError = 'Country code is not provided'
export const noPostCodeError = 'Post code is not provided'

export default ({ api }) => {
  const { createUser, updateUser } = profileSagas({ api })

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

  const savePersonalData = function*() {
    try {
      const data = yield select(selectors.form.getFormValues(PERSONAL_FORM))
      yield put(actions.form.startSubmit(PERSONAL_FORM))
      yield call(createUser, { payload: { data } })
      yield put(A.setVertificationStep(STEPS.address))
      yield put(actions.form.stopSubmit(PERSONAL_FORM))
    } catch (e) {
      yield put(actions.form.stopSubmit(PERSONAL_FORM, e))
      yield put(
        actions.logs.logErrorMessage(
          logLocation,
          'savePersonalData',
          `Error saving personal data: ${e}`
        )
      )
    }
  }

  const fetchSupportedCountries = function*() {
    try {
      yield put(A.setSupportedCountries(Remote.Loading))
      const countries = yield call(api.getSupportedCountries)
      yield put(A.setSupportedCountries(Remote.Success(countries)))
    } catch (e) {
      yield put(A.setSupportedCountries(Remote.Failure(e)))
      actions.logs.logErrorMessage(
        logLocation,
        'fetchSupportedCountries',
        `Error fetching supported countries: ${e}`
      )
    }
  }

  const fetchPossibleAddresses = function*({
    payload: { postCode, countryCode }
  }) {
    try {
      yield put(actions.form.startSubmit(ADDRESS_FORM))
      yield put(A.setPossibleAddresses([]))
      const addresses = yield callLatest(api.fetchKycAddresses, {
        postCode,
        countryCode
      })
      if (isEmpty(addresses)) throw new Error(failedToFetchAddressesError)
      yield put(A.setPossibleAddresses(addresses))
      yield put(actions.form.stopSubmit(ADDRESS_FORM))
    } catch (e) {
      if (e.description === noCountryCodeError) {
        yield put(
          actions.form.stopSubmit(ADDRESS_FORM, {
            country: 'Country code is required'
          })
        )
        return yield put(actions.form.touch(ADDRESS_FORM, 'country'))
      }
      if (e.description === noPostCodeError) {
        return yield put(
          actions.form.stopSubmit(ADDRESS_FORM, {
            postCode: 'Required'
          })
        )
      }
      if (e.message === failedToFetchAddressesError) {
        return yield put(
          actions.form.stopSubmit(ADDRESS_FORM, {
            postCode: failedToFetchAddressesError
          })
        )
      }
      yield put(actions.form.stopSubmit(ADDRESS_FORM))
      actions.logs.logErrorMessage(
        logLocation,
        'fetchPossibleAddresses',
        `Error fetching addresses: ${e}`
      )
    }
  }

  const saveAddress = function*() {
    try {
      const data = yield select(selectors.form.getFormValues(ADDRESS_FORM))
      yield put(actions.form.startSubmit(PERSONAL_FORM))
      yield call(updateUser, { payload: { data } })
      yield put(A.setVertificationStep(STEPS.verify))
      yield put(actions.form.stopSubmit(PERSONAL_FORM))
    } catch (e) {
      yield put(actions.form.stopSubmit(PERSONAL_FORM, e))
      yield put(
        actions.logs.logErrorMessage(
          logLocation,
          'saveAddress',
          `Error saving address: ${e}`
        )
      )
    }
  }

  const selectAddress = function*({
    payload: {
      address: { line1, line2, city, state }
    }
  }) {
    yield put(actions.form.change(ADDRESS_FORM, 'line1', line1))
    yield put(actions.form.change(ADDRESS_FORM, 'line2', line2))
    yield put(actions.form.change(ADDRESS_FORM, 'city', city))
    yield put(actions.form.change(ADDRESS_FORM, 'state', state))
  }

  return {
    fetchSupportedCountries,
    fetchPossibleAddresses,
    resendEmailCode,
    resendSmsCode,
    saveAddress,
    savePersonalData,
    selectAddress,
    updatePersonalStep,
    updateEmail,
    updateSmsNumber,
    verifySmsNumber,
    verifyEmail
  }
}
