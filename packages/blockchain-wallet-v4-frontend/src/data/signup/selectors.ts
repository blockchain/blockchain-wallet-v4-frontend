import { RootState } from 'data/rootReducer'

import { SignupStateType } from './types'

// TODO: organize these functions

export function getAccountRecoveryMagicLinkData(
  state: RootState
): SignupStateType['accountRecoveryMagicLinkData'] {
  return state.signup.accountRecoveryMagicLinkData
}

export function getAccountRecoveryMagicLinkDataEncoded(
  state: RootState
): SignupStateType['accountRecoveryMagicLinkDataEncoded'] {
  return state.signup.accountRecoveryMagicLinkDataEncoded
}

export function getAccountRecoveryVerify(
  state: RootState
): SignupStateType['accountRecoveryVerify'] {
  return state.signup.accountRecoveryVerify
}

export function getAccountReset(state: RootState): SignupStateType['resetAccount'] {
  return state.signup.resetAccount
}

export function getProductSignupMetadata(
  state: RootState
): SignupStateType['productSignupMetadata'] {
  return state.signup.productSignupMetadata
}

export function getRegistering(state: RootState): SignupStateType['registering'] {
  return state.signup.registering
}

export function getFirstLogin(state: RootState): SignupStateType['firstLogin'] {
  return state.signup.firstLogin
}

export function getRestoring(state: RootState): SignupStateType['restoring'] {
  return state.signup.restoring
}

export function getRegisterEmail(state: RootState): SignupStateType['registerEmail'] {
  return state.signup.registerEmail
}

export function getMetadataRestore(state: RootState): SignupStateType['metadataRestore'] {
  return state.signup.metadataRestore
}

export function getKycResetStatus(state: RootState): SignupStateType['kycReset'] {
  return state.signup.kycReset
}

export function getIsValidReferralCode(state: RootState): SignupStateType['isValidReferralCode'] {
  return state.signup.isValidReferralCode
}

export function getRecoveryTwoFAVerification(
  state: RootState
): SignupStateType['recoveryTwoFAVerification'] {
  return state.signup.recoveryTwoFAVerification
}

export function getSignupCountry(state: RootState): SignupStateType['signupCountry'] {
  return state.signup.signupCountry
}

export function getSignupCountryState(state: RootState): SignupStateType['signupCountryState'] {
  return state.signup.signupCountryState
}
