import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Remote } from '@core'

import { PlatformTypes, ProductAuthOptions } from '../auth/types'
import {
  AccountRecoveryMagicLinkData,
  MetadataRestoreType,
  ProductSignupMetadata,
  RegisteringFailureType,
  RegisteringSuccessType,
  RestoringType,
  SignupRedirectTypes,
  SignupStateType,
  VerifyTwoFAType
} from './types'

const initialState: SignupStateType = {
  accountRecoveryMagicLinkData: {},
  accountRecoveryVerify: Remote.NotAsked,
  firstLogin: false,
  isValidReferralCode: undefined,
  kycReset: undefined,
  metadataRestore: Remote.NotAsked,
  productSignupMetadata: {},
  recoveryTwoFAVerification: Remote.NotAsked,
  registerEmail: undefined,
  registering: Remote.NotAsked,
  resetAccount: false,
  restoring: Remote.NotAsked,
  signupCountry: undefined,
  signupCountryState: undefined
}

const signupSlice = createSlice({
  initialState,
  name: 'signup',
  reducers: {
    accountRecoveryVerify: (state, action?) => {},
    accountRecoveryVerifyFailure: (state, action: PayloadAction<string>) => {
      state.accountRecoveryVerify = Remote.Failure(action.payload)
    },
    accountRecoveryVerifyLoading: (state) => {
      state.accountRecoveryVerify = Remote.Loading
    },
    accountRecoveryVerifySuccess: (state, action: PayloadAction<boolean>) => {
      state.accountRecoveryVerify = Remote.Success(action.payload)
    },
    approveAccountReset: () => {},
    initializeSignup: () => {},
    pollForResetApproval: () => {},
    register: (state, action) => {},
    registerFailure: (state, action: PayloadAction<RegisteringFailureType>) => {
      state.registering = Remote.Failure(action.payload)
    },
    registerLoading: (state) => {
      state.registering = Remote.Loading
    },
    registerSuccess: (state, action: PayloadAction<RegisteringSuccessType>) => {
      state.registering = Remote.Success(action.payload)
    },
    resetAccount: (state, action) => {},
    resetAccountV2: (state, action) => {},
    restore: (state, action) => {},
    restoreFailure: () => {},
    restoreFromMetadata: (state, action) => {},
    restoreFromMetadataFailure: (state, action: PayloadAction<string>) => {
      state.metadataRestore = Remote.Failure(action.payload)
    },
    restoreFromMetadataLoading: (state) => {
      state.metadataRestore = Remote.Loading
    },
    restoreFromMetadataSuccess: (state, action: PayloadAction<MetadataRestoreType>) => {
      state.metadataRestore = Remote.Success(action.payload)
    },
    restoreLoading: (state) => {
      state.restoring = Remote.Loading
    },
    restoreSuccess: (state, action: PayloadAction<RestoringType>) => {
      state.restoring = Remote.Success(action.payload)
    },
    setAccountRecoveryMagicLinkData: (
      state,
      action: PayloadAction<AccountRecoveryMagicLinkData>
    ) => {
      state.accountRecoveryMagicLinkData = action.payload
    },
    setAccountRecoveryMagicLinkDataEncoded: (state, action: PayloadAction<string>) => {
      state.accountRecoveryMagicLinkDataEncoded = action.payload
    },
    setFirstLogin: (state, action: PayloadAction<SignupStateType['firstLogin']>) => {
      state.firstLogin = action.payload
    },
    setIsValidReferralCode: (
      state,
      action: PayloadAction<SignupStateType['isValidReferralCode']>
    ) => {
      state.isValidReferralCode = action.payload
    },
    setKycResetStatus: (state, action: PayloadAction<SignupStateType['kycReset']>) => {
      state.kycReset = action.payload
    },
    setProductSignupMetadata: (state, action: PayloadAction<ProductSignupMetadata>) => {
      const { platform, product, referrerUsername, signupRedirect, tuneTid } = action.payload
      state.productSignupMetadata = {
        platform: platform?.toUpperCase() as PlatformTypes,
        product: product?.toUpperCase() as ProductAuthOptions,
        referrerUsername,
        signupRedirect: signupRedirect?.toUpperCase() as SignupRedirectTypes,
        tuneTid
      }
    },
    setRegisterEmail: (state, action: PayloadAction<SignupStateType['registerEmail']>) => {
      state.registerEmail = action.payload
    },
    setResetAccount: (state, action: PayloadAction<SignupStateType['resetAccount']>) => {
      state.resetAccount = action.payload
    },
    setResetLogin: (state, action: PayloadAction<SignupStateType['resetAccount']>) => {
      state.resetAccount = action.payload
    },
    setSignupCountry: (state, action: PayloadAction<SignupStateType['signupCountry']>) => {
      state.signupCountry = action.payload
    },
    setSignupCountryState: (
      state,
      action: PayloadAction<SignupStateType['signupCountryState']>
    ) => {
      state.signupCountryState = action.payload
    },
    triggerRecoverEmail: (state, action) => {},
    triggerSmsVerificationRecovery: () => {},
    verifyTwoFaForRecovery: (state, action: PayloadAction<VerifyTwoFAType>) => {},
    verifyTwoFaForRecoveryFailure: (state, action) => {
      state.recoveryTwoFAVerification = Remote.Failure(action.payload)
    },
    verifyTwoFaForRecoverySuccess: (state, action) => {
      state.recoveryTwoFAVerification = Remote.Success(action.payload)
    }
  }
})

export const { actions } = signupSlice
export const signupReducer = signupSlice.reducer
