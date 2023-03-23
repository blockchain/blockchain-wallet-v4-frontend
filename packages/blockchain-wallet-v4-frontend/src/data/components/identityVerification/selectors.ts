import { KycFlowsType } from '@core/types'

import { RootState } from '../../rootReducer'

const PROVE = 'prove'

export const getVerificationStep = (state: RootState) =>
  state.components.identityVerification.verificationStep

export const getSmsStep = (state: RootState) => state.components.identityVerification.smsStep

export const getEmailStep = (state: RootState) => state.components.identityVerification.emailStep

export const getSupportedCountries = (state: RootState) =>
  state.components.identityVerification.supportedCountries

export const getSupportedDocuments = (state: RootState) =>
  state.components.identityVerification.supportedDocuments

export const getStates = (state: RootState) => state.components.identityVerification.states

export const getKycFlowConfig = (state: RootState) =>
  state.components.identityVerification.flowConfig

export const getPreIdvData = (state: RootState) => state.components.identityVerification.preIdvData

export const getSteps = (state: RootState) => state.components.identityVerification.steps
export const getKYCExtraSteps = (state: RootState) =>
  state.components.identityVerification.kycExtraQuestions

export const getUserAddresses = (state: RootState) =>
  state.components.identityVerification.userAddresses

export const getUserRetrieveAddress = (state: RootState) =>
  state.components.identityVerification.userRetrieveAddress

export const getKycFLows = (state: RootState) => state.components.identityVerification.kycFlows

export const isProveFlow = (state: RootState) => {
  const kycFlows = getKycFLows(state).getOrElse({
    attributes: {},
    nextFlow: ''
  } as KycFlowsType)

  return kycFlows.nextFlow.includes(PROVE)
}
