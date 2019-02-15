import { put, select, call } from 'redux-saga/effects'
import { head, isEmpty, prop, toUpper } from 'ramda'

import { actions, selectors, model } from 'data'
import profileSagas from 'data/modules/profile/sagas'
import { Remote } from 'blockchain-wallet-v4/src'
import * as C from 'services/AlertService'

import * as A from './actions'
import * as S from './selectors'
import {
  EMAIL_STEPS,
  SMS_STEPS,
  SMS_NUMBER_FORM,
  PERSONAL_FORM,
  BAD_CODE_ERROR,
  PHONE_EXISTS_ERROR,
  UPDATE_FAILURE,
  KYC_MODAL,
  FLOW_TYPES,
  SUNRIVER_LINK_ERROR_MODAL
} from './model'
import { computeSteps } from './services'

export const logLocation = 'components/identityVerification/sagas'

export const failedToFetchAddressesError = 'Invalid zipcode'
export const noCountryCodeError = 'Country code is not provided'
export const noPostCodeError = 'Post code is not provided'
export const invalidNumberError = 'Failed to update mobile number'
export const mobileVerifiedError = 'Failed to verify mobile number'
export const failedResendError = 'Failed to resend the code'
export const userExistsError = 'User already exists'
export const emailExistsError = 'User with this email already exists'
export const wrongFlowTypeError = 'Wrong flow type'
export const noCampaignDataError = 'User did not come from campaign'
export const invalidLinkError = 'Invalid campaign one time link'

export default ({ api, coreSagas }) => {
  const { TIERS } = model.profile
  const {
    getCampaignData,
    fetchUser,
    createUser,
    updateUser,
    updateUserAddress,
    syncUserWithWallet
  } = profileSagas({
    api,
    coreSagas
  })

  const registerUserCampaign = function*(payload) {
    const { newUser = false } = payload
    const campaign = yield select(selectors.modules.profile.getCampaign)
    try {
      if (!campaign || isEmpty(campaign)) throw new Error(noCampaignDataError)
      const campaignData = yield call(getCampaignData, campaign)
      try {
        yield call(
          api.registerUserCampaign,
          campaign.name,
          campaignData,
          newUser
        )
      } catch (error) {
        // Todo: use generic confirm modal
        // Should NOT be specific to sunriver
        yield put(
          actions.modals.showModal(SUNRIVER_LINK_ERROR_MODAL, { error })
        )
        yield put(actions.modules.profile.setCampaign({}))
        throw new Error(invalidLinkError)
      }
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(
          logLocation,
          'registerUserCampaign',
          e.message
        )
      )
    }
  }

  const createRegisterUserCampaign = function*() {
    try {
      yield call(verifyIdentity, { payload: { tier: TIERS[2] } })
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

  const selectTier = function*(tier = 2) {
    const { selected } = yield select(selectors.modules.profile.getUserTiers)
    if (selected === tier) return
    yield call(api.selectTier, tier)
    yield call(fetchUser)
  }

  const verifyIdentity = function*({ payload }) {
    const { tier, isCoinify, needMoreInfo } = payload
    yield put(
      actions.modals.showModal(KYC_MODAL, { tier, isCoinify, needMoreInfo })
    )
  }

  const defineSteps = function*(tier, isCoinify, needMoreInfo) {
    yield put(A.setStepsLoading())
    try {
      yield call(createUser)
      yield call(selectTier, tier)
      yield call(registerUserCampaign, { newUser: true })
    } catch (e) {
      return yield put(A.setStepsFailure(e))
    }
    const tiers = (yield select(
      selectors.modules.profile.getUserTiers
    )).getOrElse({
      next: 0,
      selected: 2
    })
    const mobileVerified = (yield select(selectors.modules.profile.getUserData))
      .map(prop('mobileVerified'))
      .getOrElse(false)
    const smsVerified = (yield select(
      selectors.core.settings.getSmsVerified
    )).getOrElse(0)
    const currentStep = yield select(S.getVerificationStep)
    const steps = computeSteps({
      tiers,
      mobileVerified,
      smsVerified,
      currentStep,
      isCoinify,
      needMoreInfo
    })

    yield put(A.setStepsSuccess(steps))
  }

  const initializeVerification = function*({ payload }) {
    const { tier = TIERS[2], isCoinify = false, needMoreInfo = false } = payload
    yield put(A.setEmailStep(EMAIL_STEPS.edit))
    yield call(defineSteps, tier, isCoinify, needMoreInfo)
    yield call(initializeStep)
  }

  const initializeStep = function*() {
    const steps = (yield select(S.getSteps)).getOrElse([])
    return yield put(A.setVerificationStep(head(steps)))
  }

  const goToPrevStep = function*() {
    const steps = (yield select(S.getSteps)).getOrElse([])
    const currentStep = yield select(S.getVerificationStep)
    const currentStepIndex = steps.indexOf(currentStep)
    const step = steps[currentStepIndex - 1]

    if (step) return yield put(A.setVerificationStep(step))

    yield put(actions.modals.closeAllModals())
  }

  const goToNextStep = function*() {
    const steps = (yield select(S.getSteps)).getOrElse([])
    const currentStep = yield select(S.getVerificationStep)
    const currentStepIndex = steps.indexOf(currentStep)
    const step = steps[currentStepIndex + 1]

    if (step) return yield put(A.setVerificationStep(step))

    yield put(actions.modals.closeAllModals())
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
      yield call(goToNextStep)
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
      yield call(syncUserWithWallet)
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
      yield call(updateUserAddress, {
        payload: { address }
      })

      yield put(actions.form.stopSubmit(PERSONAL_FORM))
      yield call(goToNextStep)
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

  const checkKycFlow = function*() {
    try {
      yield put(A.setKycFlow(Remote.Loading))
      const { flowType, kycProvider } = yield call(api.fetchKycConfig)
      const type = FLOW_TYPES[toUpper(flowType)]
      if (!type) throw wrongFlowTypeError

      yield put(A.setKycFlow(Remote.of({ flowType, kycProvider })))
    } catch (e) {
      yield put(A.setKycFlow(Remote.Failure(e)))
    }
  }

  const sendDeeplink = function*() {
    try {
      yield call(api.sendDeeplink)
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'sendDeeplink', e))
    }
  }

  const sendEmailVerification = function*({ payload }) {
    try {
      yield put(actions.form.startAsyncValidation(PERSONAL_FORM))
      const { email } = payload
      yield call(coreSagas.settings.resendVerifyEmail, { email })
      yield put(actions.alerts.displayInfo(C.VERIFY_EMAIL_SENT))
    } catch (e) {
      yield put(actions.alerts.displayError(C.VERIFY_EMAIL_SENT_ERROR))
      yield put(
        actions.logs.logErrorMessage(logLocation, 'resendVerifyEmail', e)
      )
    } finally {
      yield put(actions.form.stopAsyncValidation(PERSONAL_FORM))
    }
  }

  const updateEmail = function*({ payload }) {
    try {
      yield put(actions.form.startAsyncValidation(PERSONAL_FORM))
      const prevEmail = (yield select(
        selectors.core.settings.getEmail
      )).getOrElse('')
      const { email } = payload
      if (prevEmail === email)
        yield call(coreSagas.settings.resendVerifyEmail, { email })
      else yield call(coreSagas.settings.setEmail, { email })
      yield put(actions.form.stopAsyncValidation(PERSONAL_FORM))
      yield put(A.setEmailStep(EMAIL_STEPS.verify))
    } catch (e) {
      yield put(
        actions.form.stopAsyncValidation(PERSONAL_FORM, {
          email: emailExistsError
        })
      )
    }
  }

  return {
    defineSteps,
    verifyIdentity,
    initializeVerification,
    initializeStep,
    fetchStates,
    fetchSupportedCountries,
    fetchSupportedDocuments,
    goToNextStep,
    goToPrevStep,
    resendSmsCode,
    registerUserCampaign,
    createUser,
    createRegisterUserCampaign,
    savePersonalData,
    updateSmsStep,
    updateSmsNumber,
    verifySmsNumber,
    checkKycFlow,
    sendDeeplink,
    sendEmailVerification,
    selectTier,
    updateEmail
  }
}
