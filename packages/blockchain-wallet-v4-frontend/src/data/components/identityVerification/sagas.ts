import { isEmpty, prop, toUpper } from 'ramda'
import { call, delay, put, select, take } from 'redux-saga/effects'

import { Types } from '@core'
import { ExtraKYCContext, ExtraQuestionsType, RemoteDataType, SDDVerifiedType } from '@core/types'
import { actions, actionTypes, model, selectors } from 'data'
import { ModalName } from 'data/modals/types'
import { KycStateType } from 'data/types'
import * as C from 'services/alerts'

import profileSagas from '../../modules/profile/sagas'
import {
  EMAIL_STEPS,
  FLOW_TYPES,
  ID_VERIFICATION_SUBMITTED_FORM,
  INFO_AND_RESIDENTIAL_FORM,
  KYC_EXTRA_QUESTIONS_FORM,
  PERSONAL_FORM
} from './model'
import * as S from './selectors'
import computeSteps from './services'
import { actions as A } from './slice'
import { EmailSmsStepType, StateType, STEPS, StepsType } from './types'

export const logLocation = 'components/identityVerification/sagas'
export const invalidNumberError = 'Failed to update mobile number'
export const mobileVerifiedError = 'Failed to verify mobile number'
export const failedResendError = 'Failed to resend the code'
export const emailExistsError = 'User with this email already exists'
export const wrongFlowTypeError = 'Wrong flow type'
export const noCampaignDataError = 'User did not come from campaign'

export default ({ api, coreSagas, networks }) => {
  const { KYC_STATES, TIERS } = model.profile
  const {
    createUser,
    fetchUser,
    getCampaignData,
    syncUserWithWallet,
    updateUser,
    updateUserAddress
  } = profileSagas({
    api,
    coreSagas,
    networks
  })

  const verifyIdentity = function* ({ payload }) {
    yield put(actions.modals.showModal(ModalName.KYC_MODAL, payload))
  }

  const registerUserCampaign = function* (payload) {
    const { newUser = false } = payload
    const campaign = yield select(selectors.modules.profile.getCampaign)
    try {
      if (!campaign || isEmpty(campaign)) throw new Error(noCampaignDataError)
      const campaignData = yield call(getCampaignData, campaign)
      yield call(api.registerUserCampaign, campaign.name, campaignData, newUser)
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'registerUserCampaign', e.message))
    }
  }

  const createRegisterUserCampaign = function* () {
    try {
      yield call(verifyIdentity, { payload: { origin: 'Unknown', tier: 2 } })
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'createRegisterUserCampaign', e))
    }
  }

  const claimCampaignClicked = function* ({ payload }) {
    const { campaign } = payload
    try {
      yield put(actions.form.startSubmit(ID_VERIFICATION_SUBMITTED_FORM))
      yield put(actions.modules.profile.setCampaign({ name: campaign }))
      yield put(A.registerUserCampaign({ newUser: false }))
      // Buffer for tagging user
      const wallet = yield select(selectors.core.wallet.getWallet)
      if (Types.Wallet.isDoubleEncrypted(wallet)) {
        yield take([actionTypes.wallet.SUBMIT_SECOND_PASSWORD, actions.modals.closeModal.type])
      }
      yield delay(3000)
      yield put(actions.modules.profile.fetchUser())
      yield take(actionTypes.modules.profile.FETCH_USER_DATA_SUCCESS)
      const tags = (yield select(selectors.modules.profile.getTags)).getOrElse({
        [campaign]: false
      })
      const isCampaignTagged = prop(campaign, tags)
      if (!isCampaignTagged) {
        throw new Error(`${campaign} not tagged.`)
      }
      yield put(actions.form.stopSubmit(ID_VERIFICATION_SUBMITTED_FORM))
    } catch (error) {
      yield put(
        actions.form.stopSubmit(ID_VERIFICATION_SUBMITTED_FORM, {
          _error: error
        })
      )
      yield put(
        actions.logs.logErrorMessage(
          logLocation,
          'claimCampaignClicked',
          `Error claim campaign, ${error}`
        )
      )
    }
  }

  const selectTier = function* (tier = 2) {
    const { selected } = yield select(selectors.modules.profile.getUserTiers)
    if (selected === tier) return
    yield call(api.selectTier, tier)
    yield call(fetchUser)
  }

  const defineSteps = function* (tier, needMoreInfo, context) {
    yield put(A.setStepsLoading())
    try {
      yield call(createUser)
      yield call(selectTier, tier)
      yield call(registerUserCampaign, { newUser: true })
    } catch (e) {
      return yield put(A.setStepsFailure(e))
    }
    let tiers = (yield select(selectors.modules.profile.getUserTiers)).getOrElse({
      next: 0,
      selected: 2
    })
    const kycState = (
      selectors.modules.profile.getUserKYCState(yield select()) as RemoteDataType<
        string,
        KycStateType
      >
    ).getOrElse('NONE')

    // Case where user recovers their wallet with mnemonic
    // and we reset their KYC. We have to force next and
    // selected into certain states to reliably send user
    // through correct reverification flow
    const kycDocResubmissionStatus = (yield select(
      selectors.modules.profile.getKycDocResubmissionStatus
    )).getOrElse({})
    const tiersState = (yield select(selectors.modules.profile.getTiers)).getOrElse({})
    // Edge case where a user profile is set to tier two
    // but kycState is none after nabu reset
    const tierTwoKycNone = kycState === KYC_STATES.NONE && tiers.current === 2

    if (kycDocResubmissionStatus === 1) {
      if (tiers.current === 0) {
        // case where user already went through first step
        // of verification but was rejected, want to set
        // next to 2
        if (tiersState[0].state === 'rejected') {
          tiers = { current: 0, next: 2, selected: 2 }
        } else {
          tiers = { current: 0, next: 1, selected: 2 }
        }
      } else if (tierTwoKycNone || tiers.current === 1 || tiers.current === 3) {
        tiers = { current: 1, next: 2, selected: 2 }
      } else {
        return
      }
    }

    let addExtraStep = false
    // check extra KYC fields
    const contextPayload =
      tiers.current === TIERS[2] ? context : ExtraKYCContext.TIER_TWO_VERIFICATION

    yield put(actions.components.identityVerification.fetchExtraKYC(contextPayload))
    yield take([A.fetchExtraKYCSuccess.type, A.fetchExtraKYCFailure.type])
    const kycExtraSteps = selectors.components.identityVerification
      .getKYCExtraSteps(yield select())
      .getOrElse({} as ExtraQuestionsType)
    const showExtraKycSteps = kycExtraSteps?.nodes?.length > 0
    if (showExtraKycSteps) {
      addExtraStep = true
    }

    const steps = computeSteps({
      addExtraStep,
      kycState,
      needMoreInfo,
      tiers
    })

    // filter steps if tier 2, only extraKYC if needed.
    let filteredSteps = steps
    if (tiers.current === TIERS[2]) {
      filteredSteps = steps.filter((step) => {
        return step !== 'additionalInfo' && step !== 'submitted'
      })
    }

    yield put(A.setStepsSuccess(filteredSteps))
  }

  const initializeStep = function* () {
    const steps: Array<StepsType> = (yield select(S.getSteps)).getOrElse([])
    return yield put(A.setVerificationStep(steps[0]))
  }

  const initializeVerification = function* ({ payload }) {
    const {
      tier = TIERS[2],
      needMoreInfo = false,
      context = ExtraKYCContext.TIER_TWO_VERIFICATION
    } = payload
    yield put(A.setEmailStep(STEPS.edit as EmailSmsStepType))
    yield call(defineSteps, tier, needMoreInfo, context)
    const steps: Array<StepsType> = (yield select(S.getSteps)).getOrElse([])
    if (!steps.length) {
      // if no steps to be shown, close modal
      yield put(actions.components.identityVerification.setAllContextQuestionsAnswered())
      yield put(actions.modals.closeModal(ModalName.KYC_MODAL))
    } else {
      yield call(initializeStep)
    }
  }

  const goToPrevStep = function* () {
    const stepsR = S.getSteps(yield select())
    const steps = stepsR.getOrElse<Array<StepsType>, any[]>([])
    const currentStep = S.getVerificationStep(yield select())
    if (!currentStep) return
    const currentStepIndex = steps.indexOf(currentStep)
    const step = steps[currentStepIndex - 1]

    if (step) return yield put(A.setVerificationStep(step))

    yield put(actions.modals.closeModal(ModalName.KYC_MODAL))
  }

  const goToNextStep = function* () {
    const steps = (yield select(S.getSteps)).getOrElse([])
    const currentStep = S.getVerificationStep(yield select())
    const currentStepIndex = steps.indexOf(currentStep)
    const step = steps[currentStepIndex + 1]

    if (step) return yield put(A.setVerificationStep(step))

    yield put(actions.modules.profile.fetchUser())
    yield put(actions.components.identityVerification.setAllContextQuestionsAnswered())
    yield put(actions.modals.closeModal(ModalName.KYC_MODAL))
  }

  const fetchSupportedCountries = function* ({ payload }) {
    try {
      yield put(A.setSupportedCountriesLoading())
      const { scope } = payload
      const countries = yield call(api.getSupportedCountries, scope)
      yield put(A.setSupportedCountriesSuccess(countries))
    } catch (e) {
      yield put(A.setSupportedCountriesFailure(e))
      actions.logs.logErrorMessage(
        logLocation,
        'fetchSupportedCountries',
        `Error fetching supported countries: ${e}`
      )
    }
  }

  const fetchSupportedDocuments = function* () {
    try {
      yield put(A.setSupportedDocumentsLoading())
      const countryCode = (yield select(selectors.modules.profile.getUserCountryCode)).getOrElse(
        'US'
      )
      const { documentTypes } = yield call(api.getSupportedDocuments, countryCode)
      yield put(A.setSupportedDocumentsSuccess(documentTypes))
    } catch (e) {
      yield put(A.setSupportedDocumentsFailure(e))
      actions.logs.logErrorMessage(
        logLocation,
        'fetchSupportedDocuments',
        `Error fetching supported documents: ${e}`
      )
    }
  }

  const fetchStates = function* () {
    try {
      let stateList: Array<StateType> = []
      yield put(A.setStatesLoading())
      stateList = yield call(api.getStates)
      yield put(A.setStatesSuccess(stateList))
    } catch (e) {
      yield put(A.setStatesFailure(e))
      actions.logs.logErrorMessage(
        logLocation,
        'fetchStates',
        `Error fetching supported states: ${e}`
      )
    }
  }

  const checkKycFlow = function* () {
    try {
      yield put(A.setKycFlowLoading())
      try {
        const preIdvData = yield call(api.fetchPreIdvData)
        yield put(A.setPreIdvDataSuccess(preIdvData))
        yield take(A.preIdvCheckFinished)
      } catch (e) {
        yield put(A.setPreIdvDataFailure(e))
      }
      const { flowType } = yield call(api.fetchKycConfig)
      const type = FLOW_TYPES[toUpper(flowType)]
      if (!type) throw wrongFlowTypeError

      yield put(A.setKycFlowSuccess(flowType))
    } catch (e) {
      yield put(A.setKycFlowFailure(e))
    }
  }

  const sendDeepLink = function* () {
    try {
      yield call(api.sendDeepLink)
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'sendDeepLink', e))
    }
  }

  const sendEmailVerification = function* ({ payload }) {
    try {
      yield put(actions.form.startAsyncValidation(PERSONAL_FORM))
      const { email } = payload
      yield call(coreSagas.settings.resendVerifyEmail, { email }, 'VERIFICATION')
      yield put(actions.alerts.displayInfo(C.VERIFY_EMAIL_SENT))
    } catch (e) {
      yield put(actions.alerts.displayError(C.VERIFY_EMAIL_SENT_ERROR))
      yield put(actions.logs.logErrorMessage(logLocation, 'resendVerifyEmail', e))
    } finally {
      yield put(actions.form.stopAsyncValidation(PERSONAL_FORM))
    }
  }

  const updateEmail = function* ({ payload }) {
    try {
      yield put(actions.form.startAsyncValidation(PERSONAL_FORM))
      const prevEmail = (yield select(selectors.core.settings.getEmail)).getOrElse('')
      const nabuSessionToken = (yield select(selectors.modules.profile.getApiToken)).getOrFail()
      const { email } = payload
      if (prevEmail === email)
        yield call(coreSagas.settings.resendVerifyEmail, { email }, 'VERIFICATION')
      else yield call(coreSagas.settings.setEmail, email, nabuSessionToken)
      yield put(actions.form.stopAsyncValidation(PERSONAL_FORM))
      yield put(A.setEmailStep(EMAIL_STEPS.verify as EmailSmsStepType))
    } catch (e) {
      yield put(
        actions.form.stopAsyncValidation(PERSONAL_FORM, {
          email: emailExistsError
        })
      )
    }
  }

  const saveInfoAndResidentialData = function* ({ payload }) {
    try {
      yield put(actions.form.startSubmit(INFO_AND_RESIDENTIAL_FORM))
      yield call(syncUserWithWallet)
      const { city, country, dob, firstName, lastName, line1, line2, postCode, state } =
        yield select(selectors.form.getFormValues(INFO_AND_RESIDENTIAL_FORM))
      const personalData = { dob, firstName, lastName }
      const hasCowboysTag = selectors.modules.profile.getCowboysTag(yield select()).getOrElse(false)

      const address = {
        city,
        country,
        line1,
        line2,
        postCode,
        state: state?.code ?? null
      }

      yield call(updateUser, { payload: { data: personalData } })
      yield call(updateUserAddress, {
        payload: { address }
      })

      if (payload.checkSddEligibility) {
        const POLL_SDD_DELAY = 3000
        let sddVerified: SDDVerifiedType
        let callCount = 0

        // poll for SDD verified check to complete
        // 10 call max * 3 second intervals = 30 second wait before forcing gold flow
        while (true) {
          callCount += 1
          if (callCount >= 10) {
            sddVerified = { taskComplete: true, verified: false }
            break
          }
          sddVerified = yield call(api.fetchSDDVerified)
          if (sddVerified?.taskComplete) {
            yield put(actions.components.buySell.fetchSDDVerifiedSuccess(sddVerified))
            break
          }
          yield delay(POLL_SDD_DELAY)
        }

        if (sddVerified.verified) {
          if (hasCowboysTag) {
            const questions = yield call(
              api.fetchKYCExtraQuestions,
              ExtraKYCContext.TIER_TWO_VERIFICATION
            )
            if (!questions.nodes || !questions.nodes.length) {
              yield put(
                actions.modals.showModal(ModalName.COWBOYS_PROMO, {
                  origin: 'CowboysCard',
                  step: 'raffleEntered'
                })
              )
            }
          }
          // SDD verified, refetch user profile
          yield put(actions.modules.profile.fetchUser())
          // run callback to get back to BS flow
          if (payload.onCompletionCallback) {
            payload.onCompletionCallback()
          }

          // wait for BS create to finish
          yield take([
            actions.components.buySell.fetchOrdersSuccess.type,
            actions.components.buySell.fetchOrdersFailure.type
          ])
          // close KYC modal
          yield put(actions.modals.closeModal(ModalName.KYC_MODAL))
        } else {
          // SDD denied, continue to veriff
          yield call(goToNextStep)
          // create BS order in background in case user drops out of veriff flow
          if (payload.onCompletionCallback) {
            payload.onCompletionCallback()
          }
        }
      } else {
        yield call(goToNextStep)
      }

      yield put(actions.form.stopSubmit(INFO_AND_RESIDENTIAL_FORM))
      yield put(actions.modules.profile.fetchUser())
    } catch (e) {
      yield put(
        actions.form.stopSubmit(INFO_AND_RESIDENTIAL_FORM, {
          _error: typeof e === 'string' ? e : e.description
        })
      )
      yield put(
        actions.logs.logErrorMessage(
          logLocation,
          'saveInfoAndResidentialData',
          `Error saving info and residential data: ${e}`
        )
      )
    }
  }

  const fetchExtraKYC = function* ({ payload }) {
    try {
      yield put(A.fetchExtraKYCLoading())
      const questions = yield call(api.fetchKYCExtraQuestions, payload)
      yield put(A.fetchExtraKYCSuccess(questions))
    } catch (e) {
      yield put(A.fetchExtraKYCFailure(e))
      actions.logs.logErrorMessage(logLocation, 'fetchExtraKYC', `Error fetching extra KYC: ${e}`)
    }
  }

  const saveKYCExtraQuestions = function* () {
    try {
      yield put(actions.form.startSubmit(KYC_EXTRA_QUESTIONS_FORM))
      const extraForm = selectors.components.identityVerification
        .getKYCExtraSteps(yield select())
        .getOrElse({} as ExtraQuestionsType)

      yield call(api.updateKYCExtraQuestions, extraForm)

      yield put(actions.form.stopSubmit(KYC_EXTRA_QUESTIONS_FORM))
      // return to KYC
      yield call(goToNextStep)
    } catch (e) {
      yield put(
        actions.form.stopSubmit(KYC_EXTRA_QUESTIONS_FORM, {
          _error: typeof e === 'string' ? e : e.description
        })
      )
      yield put(
        actions.logs.logErrorMessage(
          logLocation,
          'saveInfoAndResidentialData',
          `Error saving info and residential data: ${e}`
        )
      )
    }
  }

  return {
    checkKycFlow,
    claimCampaignClicked,
    createRegisterUserCampaign,
    createUser,
    defineSteps,
    fetchExtraKYC,
    fetchStates,
    fetchSupportedCountries,
    fetchSupportedDocuments,
    goToNextStep,
    goToPrevStep,
    initializeStep,
    initializeVerification,
    registerUserCampaign,
    saveInfoAndResidentialData,
    saveKYCExtraQuestions,
    selectTier,
    sendDeepLink,
    sendEmailVerification,
    updateEmail,
    verifyIdentity
  }
}
