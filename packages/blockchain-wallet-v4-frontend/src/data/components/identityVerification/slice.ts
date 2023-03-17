/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Remote } from '@core'
import { ExtraQuestionsType, FindAddressResponse, KycFlowsType, RetrieveAddress } from '@core/types'

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
  VerifyIdentityPayload
} from './types'

const initialState: IdentityVerificationState = {
  emailStep: EMAIL_STEPS.edit as EmailSmsStepType,
  flowConfig: Remote.NotAsked,
  kycExtraQuestions: Remote.NotAsked,
  kycFlows: Remote.NotAsked,
  preIdvData: Remote.NotAsked,
  smsStep: Remote.Loading,
  states: Remote.NotAsked,
  steps: Remote.NotAsked,
  supportedCountries: Remote.NotAsked,
  supportedDocuments: Remote.NotAsked,
  userAddresses: Remote.NotAsked,
  userRetrieveAddress: Remote.NotAsked,
  verificationStep: null
}

const identityVerificationSlice = createSlice({
  initialState,
  name: 'identityVerification',
  reducers: {
    checkIsNameValid: (state, action: PayloadAction<{ firstName: string; lastName: string }>) => {},
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

    fetchKYCFlows: (state, action: PayloadAction<string>) => {},
    fetchKYCFlowsFailure: (state, action: PayloadAction<string>) => {
      state.kycFlows = Remote.Failure(action.payload)
    },
    fetchKYCFlowsLoading: (state) => {
      state.kycFlows = Remote.Loading
    },
    fetchKYCFlowsSuccess: (state, action: PayloadAction<KycFlowsType>) => {
      state.kycFlows = Remote.Success(action.payload)
    },

    fetchStates: () => {},
    fetchSupportedCountries: (state, action: PayloadAction<{ scope?: string }>) => {},
    fetchSupportedDocuments: (state, action: PayloadAction<{ countryCode?: string }>) => {},

    fetchUserAddress: (
      state,
      action: PayloadAction<{ countryCode?: string; id?: string; text: string }>
    ) => {},

    fetchUserAddressFailure: (state, action: PayloadAction<string>) => {
      state.userAddresses = Remote.Failure(action.payload)
    },
    fetchUserAddressLoading: (state) => {
      state.userAddresses = Remote.Loading
    },
    fetchUserAddressSuccess: (state, action: PayloadAction<FindAddressResponse>) => {
      state.userAddresses = Remote.Success(action.payload)
    },

    getPreIdvData: () => {},
    goToNextStep: () => {},
    goToPrevStep: () => {},

    initializeVerification: (
      state,
      action: PayloadAction<{
        context: string
        needMoreInfo: boolean
        origin: string
        tier: number
      }>
    ) => {},
    kycModalClosed: () => {},
    preIdvCheckFinished: () => {},
    registerUserCampaign: (state, action: PayloadAction<{ newUser: boolean }>) => {},
    resetVerificationStep: (state, action) => {
      state.verificationStep = null
    },

    retrieveUserAddress: (state, action: PayloadAction<{ id?: string }>) => {},
    retrieveUserAddressFailure: (state, action: PayloadAction<string>) => {
      state.userRetrieveAddress = Remote.Failure(action.payload)
    },
    retrieveUserAddressLoading: (state) => {
      state.userRetrieveAddress = Remote.Loading
    },
    retrieveUserAddressSuccess: (state, action: PayloadAction<RetrieveAddress>) => {
      state.userRetrieveAddress = Remote.Success(action.payload)
    },
    saveKYCExtraQuestions: () => {},
    saveUserInfoData: (state) => {},
    saveUserResidentialData: () => {},
    sendDeepLink: () => {},
    sendEmailVerification: (state, action: PayloadAction<{ email: string }>) => {},
    setAllContextQuestionsAnswered: () => {},
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
    setStepsSuccess: (state, action: PayloadAction<Array<StepsType>>) => {
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
    verifyIdentity: (state, action: PayloadAction<VerifyIdentityPayload>) => {}
  }
})

const { actions } = identityVerificationSlice
const identityVerificationReducer = identityVerificationSlice.reducer
export { actions, identityVerificationReducer }
