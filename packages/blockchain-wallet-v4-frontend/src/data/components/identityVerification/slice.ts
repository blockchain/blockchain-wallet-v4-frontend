/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Remote } from '@core'
import { ExtraQuestionsType } from '@core/types'

import { EMAIL_STEPS } from './model'
import {
  CampaignsType,
  CountryType,
  DocumentType,
  EmailSmsStepType,
  IdentityVerificationState,
  PreIdvDataType,
  StateType,
  StepsType,
  VerifyIdentityOriginType
} from './types'

const initialState: IdentityVerificationState = {
  addressRefetchVisible: false,
  emailStep: EMAIL_STEPS.edit as EmailSmsStepType,
  flowConfig: Remote.NotAsked,
  kycExtraQuestions: Remote.NotAsked,
  preIdvData: Remote.NotAsked,
  smsStep: Remote.Loading,
  states: Remote.NotAsked,
  steps: Remote.NotAsked,
  supportedCountries: Remote.NotAsked,
  supportedDocuments: Remote.NotAsked,
  verificationStep: null
}

const identityVerificationSlice = createSlice({
  initialState,
  name: 'identityVerification',
  reducers: {
    checkKycFlow: (state, action) => {},
    claimCampaignClicked: (state, action: PayloadAction<{ campaign: CampaignsType }>) => {},
    createRegisterUserCampaign: (state, action) => {},
    fetchExtraKYC: (state, action: PayloadAction<string>) => {},
    fetchExtraKYCFailure: (state, action: PayloadAction<string>) => {
      state.kycExtraQuestions = Remote.Failure(action.payload)
    },
    fetchExtraKYCLoading: (state) => {
      state.kycExtraQuestions = Remote.Loading
    },
    fetchExtraKYCSuccess: (state, action: PayloadAction<ExtraQuestionsType>) => {
      state.kycExtraQuestions = Remote.Success(action.payload)
    },
    fetchStates: () => {},
    fetchSupportedCountries: (state, action: PayloadAction<{ scope?: string }>) => {},
    fetchSupportedDocuments: (state, action: PayloadAction<{ countryCode?: string }>) => {},

    getPreIdvData: () => {},
    goToNextStep: () => {},
    goToPrevStep: () => {},

    initializeVerification: (
      state,
      action: PayloadAction<{ needMoreInfo: boolean; origin: string; tier: number }>
    ) => {},

    preIdvCheckFinished: () => {},
    registerUserCampaign: (state, action: PayloadAction<{ newUser: boolean }>) => {},
    resendSmsCode: (state, action) => {},
    resetVerificationStep: (state, action) => {
      state.verificationStep = null
    },

    saveInfoAndResidentialData: (
      state,
      action: PayloadAction<{ checkSddEligibility?: boolean; onCompletionCallback?: () => void }>
    ) => {},

    saveKYCExtraQuestions: () => {},
    sendDeepLink: () => {},
    sendEmailVerification: (state, action: PayloadAction<{ email: string }>) => {},
    setEmailStep: (state, action: PayloadAction<EmailSmsStepType>) => {
      state.emailStep = action.payload
    },
    setKycFlowFailure: (state, action: PayloadAction<string>) => {
      state.flowConfig = Remote.Failure(action.payload)
    },
    setKycFlowLoading: (state) => {
      state.flowConfig = Remote.Loading
    },

    setKycFlowSuccess: (state, action: PayloadAction<any>) => {
      state.flowConfig = Remote.Success(action.payload)
    },
    setPreIdvDataFailure: (state, action: PayloadAction<string>) => {
      state.preIdvData = Remote.Failure(action.payload)
    },

    setPreIdvDataLoading: (state) => {
      state.preIdvData = Remote.Loading
    },
    setPreIdvDataSuccess: (state, action: PayloadAction<PreIdvDataType>) => {
      state.preIdvData = Remote.Success(action.payload)
    },
    setSmsStep: (state, action: PayloadAction<EmailSmsStepType>) => {
      state.smsStep = Remote.Success(action.payload)
    },

    setStatesFailure: (state, action: PayloadAction<string>) => {
      state.states = Remote.Failure(action.payload)
    },
    setStatesLoading: (state) => {
      state.states = Remote.Loading
    },
    setStatesSuccess: (state, action: PayloadAction<Array<StateType>>) => {
      state.states = Remote.Success(action.payload)
    },

    setStepsFailure: (state, action: PayloadAction<string>) => {
      state.steps = Remote.Failure(action.payload)
    },
    setStepsLoading: (state) => {
      state.steps = Remote.Loading
    },
    setStepsSuccess: (state, action: PayloadAction<Array<string>>) => {
      state.steps = Remote.Success(action.payload)
    },
    setSupportedCountriesFailure: (state, action: PayloadAction<string>) => {
      state.supportedCountries = Remote.Failure(action.payload)
    },

    setSupportedCountriesLoading: (state) => {
      state.supportedCountries = Remote.Loading
    },
    setSupportedCountriesSuccess: (state, action: PayloadAction<Array<CountryType>>) => {
      state.supportedCountries = Remote.Success(action.payload)
    },
    setSupportedDocumentsFailure: (state, action: PayloadAction<string>) => {
      state.supportedDocuments = Remote.Failure(action.payload)
    },
    setSupportedDocumentsLoading: (state) => {
      state.supportedDocuments = Remote.Loading
    },
    setSupportedDocumentsSuccess: (state, action: PayloadAction<Array<DocumentType>>) => {
      state.supportedDocuments = Remote.Success(action.payload)
    },
    setVerificationStep: (state, action: PayloadAction<StepsType>) => {
      state.verificationStep = action.payload
    },
    updateEmail: (state, action: PayloadAction<{ email: string }>) => {},
    updateExtraKYCQuestions: (state, action: PayloadAction<ExtraQuestionsType>) => {
      state.kycExtraQuestions = Remote.Success(action.payload)
    },
    updateSmsNumber: () => {},
    updateSmsStep: () => {},
    verifyIdentity: (
      state,
      action: PayloadAction<{
        checkSddEligibility?: boolean
        needMoreInfo?: boolean
        onCompletionCallback?: () => void
        origin: VerifyIdentityOriginType
        tier: number
      }>
    ) => {},
    verifySmsNumber: () => {}
  }
})

const { actions } = identityVerificationSlice
const identityVerificationReducer = identityVerificationSlice.reducer
export { actions, identityVerificationReducer }
