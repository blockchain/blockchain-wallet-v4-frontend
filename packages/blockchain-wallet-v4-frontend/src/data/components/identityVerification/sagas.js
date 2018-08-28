import { put, select, call } from 'redux-saga/effects'
import { isEmpty } from 'ramda'

import { callLatest } from 'utils/effects'
import { actions, selectors, model } from 'data'
import profileSagas from 'data/modules/profile/sagas'
import { Remote } from 'blockchain-wallet-v4/src'
import * as C from 'services/AlertService'

import * as A from './actions'
import { STEPS, SMS_STEPS, SMS_NUMBER_FORM, PERSONAL_FORM } from './model'

export const logLocation = 'components/identityVerification/sagas'

export const failedToFetchAddressesError = 'Invalid zipcode'
export const noCountryCodeError = 'Country code is not provided'
export const noPostCodeError = 'Post code is not provided'
export const invalidNumberError = 'Failed to update mobile number'
export const mobileVerifiedError = 'Failed to verify mobile number'
export const failedResendError = 'Failed to resend the code'
export const userExistsError = 'User already exists'
export const getUserExistsError = email =>
  `User with email ${email} already exists`

export default ({ api, coreSagas }) => {
  const { USER_ACTIVATION_STATES } = model.profile
  const {
    createUser,
    updateUser,
    updateUserAddress,
    syncUserWithWallet
  } = profileSagas({
    api,
    coreSagas
  })

  const initializeStep = function*() {
    const activationState = yield select(
      selectors.modules.profile.getUserActivationState
    )
    if (activationState === USER_ACTIVATION_STATES.NONE)
      return yield put(A.setVerificationStep(STEPS.personal))
    if (activationState === USER_ACTIVATION_STATES.CREATED)
      return yield put(A.setVerificationStep(STEPS.mobile))
    if (activationState === USER_ACTIVATION_STATES.ACTIVE)
      return yield put(A.setVerificationStep(STEPS.verify))
  }

  const updateSmsStep = ({ smsNumber, smsVerified }) => {
    if (smsNumber && !smsVerified) return SMS_STEPS.verify
    return SMS_STEPS.edit
  }

  const updateSmsNumber = function*() {
    try {
      const { smsNumber } = yield select(
        selectors.form.getFormValues(SMS_NUMBER_FORM)
      )
      yield put(actions.form.startSubmit(SMS_NUMBER_FORM))
      yield call(coreSagas.settings.setMobile, { mobile: smsNumber })
      yield put(A.setSmsStep(SMS_STEPS.verify))
      yield put(actions.form.stopSubmit(SMS_NUMBER_FORM))
    } catch (e) {
      yield put(
        actions.form.stopSubmit(SMS_NUMBER_FORM, {
          smsNumber: invalidNumberError
        })
      )
    }
  }

  const verifySmsNumber = function*() {
    try {
      yield put(actions.form.startSubmit(SMS_NUMBER_FORM))
      const { code } = yield select(
        selectors.form.getFormValues(SMS_NUMBER_FORM)
      )
      yield call(coreSagas.settings.setMobileVerified, { code })
      yield call(syncUserWithWallet)
      yield put(actions.form.stopSubmit(SMS_NUMBER_FORM))
      yield put(A.setVerificationStep(STEPS.verify))
    } catch (e) {
      yield put(
        actions.form.stopSubmit(SMS_NUMBER_FORM, { mobileVerifiedError })
      )
    }
  }

  const resendSmsCode = function*() {
    try {
      yield put(actions.form.startSubmit(SMS_NUMBER_FORM))
      const smsNumber = (yield select(
        selectors.core.settings.getSmsNumber
      )).getOrFail()
      yield call(coreSagas.settings.setMobile, { mobile: smsNumber })
      yield put(actions.form.stopSubmit(SMS_NUMBER_FORM))
      yield put(actions.alerts.displaySuccess(C.SMS_RESEND_SUCCESS))
    } catch (e) {
      yield put(
        actions.form.stopSubmit(SMS_NUMBER_FORM, {
          code: failedResendError
        })
      )
    }
  }

  const savePersonalData = function*() {
    try {
      const {
        firstName,
        lastName,
        dob,
        line1,
        line2,
        city,
        country,
        state,
        postCode
      } = yield select(selectors.form.getFormValues(PERSONAL_FORM))
      const personalData = { firstName, lastName, dob }
      const address = {
        line1,
        line2,
        city,
        country: country.name,
        state,
        postCode
      }
      yield put(actions.form.startSubmit(PERSONAL_FORM))
      yield call(updateUser, { payload: { data: personalData } })
      yield call(updateUserAddress, { payload: { address } })
      const smsVerified = (yield select(
        selectors.core.settings.getSmsVerified
      )).getOrElse(0)

      if (!smsVerified) {
        yield put(actions.form.stopSubmit(PERSONAL_FORM))
        return yield put(A.setVerificationStep(STEPS.mobile))
      }

      // Skipping mobile verification step
      yield call(syncUserWithWallet)
      yield put(actions.form.stopSubmit(PERSONAL_FORM))
      yield put(A.setVerificationStep(STEPS.verify))
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
      yield put(A.setAddressRefetchVisible(false))
      yield put(actions.form.startSubmit(PERSONAL_FORM))
      yield put(A.setPossibleAddresses([]))
      yield call(createUser)
      const addresses = yield callLatest(api.fetchKycAddresses, {
        postCode,
        countryCode
      })
      if (isEmpty(addresses)) throw new Error(failedToFetchAddressesError)
      yield put(A.setPossibleAddresses(addresses))
      yield put(actions.form.stopSubmit(PERSONAL_FORM))
    } catch (e) {
      if (e.description === userExistsError) {
        // TODO: show a better error explaining that user with
        // target email already exists
        const email = (yield select(
          selectors.core.settings.getEmail
        )).getOrFail()
        return yield put(
          actions.form.stopSubmit(PERSONAL_FORM, {
            postCode: getUserExistsError(email)
          })
        )
      }

      if (e.description === noCountryCodeError) {
        yield put(
          actions.form.stopSubmit(PERSONAL_FORM, {
            country: 'Country code is required'
          })
        )
        return yield put(actions.form.touch(PERSONAL_FORM, 'country'))
      }
      if (e.description === noPostCodeError) {
        return yield put(
          actions.form.stopSubmit(PERSONAL_FORM, {
            postCode: 'Required'
          })
        )
      }
      if (e.message === failedToFetchAddressesError) {
        return yield put(
          actions.form.stopSubmit(PERSONAL_FORM, {
            postCode: failedToFetchAddressesError
          })
        )
      }
      yield put(actions.form.stopSubmit(PERSONAL_FORM))
      yield put(A.setAddressRefetchVisible(true))
      yield put(
        actions.logs.logErrorMessage(
          logLocation,
          'fetchPossibleAddresses',
          `Error fetching addresses: ${e}`
        )
      )
    }
  }

  const selectAddress = function*({
    payload: {
      address: { line1, line2, city, state }
    }
  }) {
    yield put(actions.form.change(PERSONAL_FORM, 'line1', line1))
    yield put(actions.form.change(PERSONAL_FORM, 'line2', line2))
    yield put(actions.form.change(PERSONAL_FORM, 'city', city))
    yield put(actions.form.change(PERSONAL_FORM, 'state', state))
  }

  return {
    initializeStep,
    fetchSupportedCountries,
    fetchPossibleAddresses,
    resendSmsCode,
    savePersonalData,
    selectAddress,
    updateSmsStep,
    updateSmsNumber,
    verifySmsNumber
  }
}
