import { put, select, call } from 'redux-saga/effects'
import { prop } from 'ramda'

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
  USER_EXISTS_MODAL,
  SUNRIVER_LINK_ERROR_MODAL
} from './model'

export const logLocation = 'components/identityVerification/sagas'

export const failedToFetchAddressesError = 'Invalid zipcode'
export const noCountryCodeError = 'Country code is not provided'
export const noPostCodeError = 'Post code is not provided'
export const invalidNumberError = 'Failed to update mobile number'
export const mobileVerifiedError = 'Failed to verify mobile number'
export const failedResendError = 'Failed to resend the code'
export const userExistsError = 'User already exists'

export default ({ api, coreSagas }) => {
  const {
    EMAIL_EXISTS,
    REENTERED,
    STARTED,
    PERSONAL_STEP_COMPLETE,
    MOBILE_STEP_COMPLETE
  } = model.analytics.KYC
  const { USER_ACTIVATION_STATES } = model.profile
  const {
    getCampaignData,
    createUser,
    updateUser,
    generateRetailToken,
    updateUserAddress,
    syncUserWithWallet
  } = profileSagas({
    api,
    coreSagas
  })

  const registerUserCampaign = function*(newUser = false) {
    const campaign = yield select(selectors.modules.profile.getCampaign)
    const campaignData = yield call(getCampaignData, campaign)
    const token = (yield select(
      selectors.modules.profile.getApiToken
    )).getOrFail()
    try {
      yield call(
        api.registerUserCampaign,
        token,
        campaign.name,
        campaignData,
        newUser
      )
    } catch (e) {
      yield put(actions.modals.showModal(SUNRIVER_LINK_ERROR_MODAL))
      yield put(
        actions.logs.logErrorMessage(logLocation, 'registerUserCampaign', e)
      )
    }
  }

  const createRegisterUserCampaign = function*({
    payload: { needsIdVerification }
  }) {
    try {
      if (!needsIdVerification) return yield call(registerUserCampaign)

      const userId = (yield select(
        selectors.core.kvStore.userCredentials.getUserId
      )).getOrElse('')
      const userWithEmailExists = yield call(verifyIdentity)
      if (userWithEmailExists) return
      if (!userId) yield call(createUser)
      if (userId) yield call(registerUserCampaign, true)
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(
          logLocation,
          'createRegisterUserCampaign',
          e
        )
      )
    }
  }

  const verifyIdentity = function*() {
    try {
      const userId = (yield select(
        selectors.core.kvStore.userCredentials.getUserId
      )).getOrElse('')
      if (userId) {
        yield put(actions.analytics.logKycEvent(REENTERED))
        yield put(actions.modals.showModal(KYC_MODAL))
        return false
      }
      const retailToken = yield call(generateRetailToken)
      yield call(api.checkUserExistence, retailToken)
      yield put(actions.modals.showModal(USER_EXISTS_MODAL))
      yield put(actions.analytics.logKycEvent(EMAIL_EXISTS))
      return true
    } catch (e) {
      yield put(actions.analytics.logKycEvent(STARTED))
      yield put(actions.modals.showModal(KYC_MODAL))
      return false
    }
  }

  const initializeStep = function*() {
    const activationState = (yield select(
      selectors.modules.profile.getUserActivationState
    )).getOrElse(USER_ACTIVATION_STATES.NONE)
    const mobileVerified = (yield select(selectors.modules.profile.getUserData))
      .map(prop('mobileVerified'))
      .getOrElse(false)
    if (activationState === USER_ACTIVATION_STATES.NONE)
      return yield put(A.setVerificationStep(STEPS.personal))
    if (mobileVerified) return yield put(A.setVerificationStep(STEPS.verify))
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
      yield put(actions.analytics.logKycEvent(MOBILE_STEP_COMPLETE))
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
      yield put(actions.form.startSubmit(PERSONAL_FORM))
      yield call(createUser)
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
      yield call(updateUser, { payload: { data: personalData } })
      const { mobileVerified } = yield call(updateUserAddress, {
        payload: { address }
      })
      const smsVerified = (yield select(
        selectors.core.settings.getSmsVerified
      )).getOrElse(0)

      if (!smsVerified && !mobileVerified) {
        yield put(actions.form.stopSubmit(PERSONAL_FORM))
        yield put(actions.analytics.logKycEvent(PERSONAL_STEP_COMPLETE))
        return yield put(A.setVerificationStep(STEPS.mobile))
      }

      // Skipping mobile verification step
      yield call(syncUserWithWallet)
      yield put(actions.form.stopSubmit(PERSONAL_FORM))
      yield put(A.setVerificationStep(STEPS.verify))
      yield put(actions.analytics.logKycEvent(PERSONAL_STEP_COMPLETE))
    } catch (e) {
      yield put(actions.form.stopSubmit(PERSONAL_FORM, { _error: e }))
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

  const fetchSupportedDocuments = function*() {
    try {
      yield put(A.setSupportedDocuments(Remote.Loading))
      const countryCode = (yield select(
        selectors.modules.profile.getUserCountryCode
      )).getOrElse('US')
      const { documentTypes } = yield call(
        api.getSupportedDocuments,
        countryCode
      )
      yield put(A.setSupportedDocuments(Remote.Success(documentTypes)))
    } catch (e) {
      yield put(A.setSupportedDocuments(Remote.Failure(e)))
      actions.logs.logErrorMessage(
        logLocation,
        'fetchSupportedDocuments',
        `Error fetching supported documents: ${e}`
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

  return {
    verifyIdentity,
    initializeStep,
    fetchStates,
    fetchSupportedCountries,
    fetchSupportedDocuments,
    resendSmsCode,
    createRegisterUserCampaign,
    savePersonalData,
    updateSmsStep,
    updateSmsNumber,
    verifySmsNumber
  }
}
