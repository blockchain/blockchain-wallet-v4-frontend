import { join, put, select, call, spawn } from 'redux-saga/effects'
import { isEmpty, prop } from 'ramda'

import { callLatest } from 'utils/effects'
import { actions, selectors, model } from 'data'
import profileSagas from 'data/modules/profile/sagas'
import { Remote } from 'blockchain-wallet-v4/src'
import * as C from 'services/AlertService'

import * as A from './actions'
import {
  STEPS,
  SMS_STEPS,
  SMS_NUMBER_FORM,
  PERSONAL_FORM,
  BAD_CODE_ERROR,
  PHONE_EXISTS_ERROR,
  UPDATE_FAILURE,
  KYC_MODAL,
  USER_EXISTS_MODAL
} from './model'

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
    generateRetailToken,
    updateUserAddress,
    syncUserWithWallet
  } = profileSagas({
    api,
    coreSagas
  })

  const verifyIdentity = function*() {
    try {
      const userId = (yield select(
        selectors.core.kvStore.userCredentials.getUserId
      )).getOrElse('')
      if (userId) {
        return yield put(actions.modals.showModal(KYC_MODAL))
      }
      const retailToken = yield call(generateRetailToken)
      yield call(api.checkUserExistance, retailToken)
      yield put(actions.modals.showModal(USER_EXISTS_MODAL))
    } catch (e) {
      yield put(actions.modals.showModal(KYC_MODAL))
    }
  }

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
      const description = prop('description', e)

      let error
      if (description === PHONE_EXISTS_ERROR) error = PHONE_EXISTS_ERROR
      else if (e === BAD_CODE_ERROR) error = BAD_CODE_ERROR
      else error = UPDATE_FAILURE
      yield put(actions.form.stopSubmit(SMS_NUMBER_FORM, { _error: error }))
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
        country: country.code,
        state,
        postCode
      }
      if (address.country === 'US') address.state = address.state.code
      yield put(actions.form.startSubmit(PERSONAL_FORM))
      yield call(updateUser, { payload: { data: personalData } })
      const { mobileVerified } = yield call(updateUserAddress, {
        payload: { address }
      })
      const smsVerified = (yield select(
        selectors.core.settings.getSmsVerified
      )).getOrElse(0)

      if (!smsVerified && !mobileVerified) {
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

  const fetchStates = function*() {
    try {
      yield put(A.setStates(Remote.Loading))
      const states = yield call(api.getStates)
      yield put(A.setStates(Remote.Success(states)))
    } catch (e) {
      yield put(A.setStates(Remote.Failure(e)))
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

      // Spawn/join is used so that
      // createUser task won't be canceled by takeLatest
      // and addresses fetch will be canceled
      const createUserTask = yield spawn(createUser)
      yield join(createUserTask)
      const addresses = yield callLatest(api.fetchKycAddresses, {
        postCode,
        countryCode
      })
      yield put(A.setPossibleAddresses(addresses))
      if (!isEmpty(addresses))
        yield put(actions.form.focus(PERSONAL_FORM, 'address'))
      yield put(actions.form.stopSubmit(PERSONAL_FORM))
    } catch (e) {
      const description = prop('description', e)
      const message = prop('message', e)

      // occurs if typing fast and 2 user tasks are created
      if (description === userExistsError) return

      if (description === noCountryCodeError) {
        yield put(
          actions.form.stopSubmit(PERSONAL_FORM, {
            country: 'Country code is required'
          })
        )
        return yield put(actions.form.touch(PERSONAL_FORM, 'country'))
      }
      if (description === noPostCodeError) {
        return yield put(
          actions.form.stopSubmit(PERSONAL_FORM, {
            postCode: 'Required'
          })
        )
      }
      if (message === failedToFetchAddressesError) {
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

  const selectAddress = function*({ payload }) {
    const address = prop('address', payload)
    const { country, state: usState } = yield select(
      selectors.form.getFormValues(PERSONAL_FORM)
    )
    if (!address) return
    const { line1, line2, city, state } = address
    yield put(actions.form.change(PERSONAL_FORM, 'line1', line1))
    yield put(actions.form.change(PERSONAL_FORM, 'line2', line2))
    yield put(actions.form.change(PERSONAL_FORM, 'city', city))
    if (prop('code', country) !== 'US') {
      yield put(actions.form.change(PERSONAL_FORM, 'address', address))
      yield put(actions.form.change(PERSONAL_FORM, 'state', state))
    } else {
      yield put(
        actions.form.change(PERSONAL_FORM, 'address', {
          ...address,
          state: usState
        })
      )
    }
  }

  return {
    verifyIdentity,
    initializeStep,
    fetchSupportedCountries,
    fetchStates,
    fetchPossibleAddresses,
    resendSmsCode,
    savePersonalData,
    selectAddress,
    updateSmsStep,
    updateSmsNumber,
    verifySmsNumber
  }
}
