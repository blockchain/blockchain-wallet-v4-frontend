import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Remote } from '@core'

import {
  AccountUnificationFlows,
  AuthStateType,
  ExchangeLoginFailureType,
  ExchangeLoginSuccessType,
  ExchangeLoginType,
  ExchangeResetPasswordFailureType,
  ExchangeResetPasswordSuccessType,
  LoginFailureType,
  LoginRoutinePayloadType,
  LoginSuccessType,
  MetadataRestoreType,
  PlatformTypes,
  ProductAuthMetadata,
  ProductAuthOptions,
  RegisteringFailureType,
  RegisteringSuccessType,
  RestoringType,
  SecureChannelLoginType
} from './types'

const initialState: AuthStateType = {
  accountUnificationFlow: undefined,
  auth_type: 0,
  authorizeVerifyDevice: Remote.NotAsked,
  exchangeAuth: {
    exchangeLogin: Remote.NotAsked,
    exchangeLoginError: undefined,
    jwtToken: undefined,
    resetPassword: Remote.NotAsked
  },
  firstLogin: false,
  isAuthenticated: false,
  isLoggingIn: false,
  kycReset: undefined,
  login: Remote.NotAsked,
  magicLinkData: undefined,
  magicLinkDataEncoded: undefined,
  manifestFile: null,
  metadataRestore: Remote.NotAsked,
  mobileLoginStarted: false,
  productAuthMetadata: {
    platform: PlatformTypes.WEB,
    product: undefined,
    redirect: undefined
  },
  registerEmail: undefined,
  registering: Remote.NotAsked,
  resetAccount: false,
  restoring: Remote.NotAsked,
  secureChannelLogin: Remote.NotAsked
}

const authSlice = createSlice({
  initialState,
  name: 'auth',
  reducers: {
    analyticsAuthorizeVerifyDeviceFailure: (state, action) => {},
    analyticsAuthorizeVerifyDeviceSuccess: () => {},
    analyticsLoginIdEntered: (state, action) => {},
    analyticsLoginMethodSelected: (state, action) => {},
    analyticsLoginPasswordDenied: () => {},
    analyticsLoginPasswordEntered: () => {},
    analyticsLoginTwoStepVerificationDenied: () => {},
    analyticsLoginTwoStepVerificationEntered: () => {},
    analyticsMagicLinkParsed: () => {},
    analyticsNeedHelpClicked: (state, action) => {},
    analyticsRecoveryOptionSelected: (state, action) => {},
    analyticsRecoveryPhraseEntered: () => {},
    analyticsResetAccountCancelled: (state, action) => {},
    analyticsResetAccountClicked: (state, action) => {},
    authenticate: (state) => {
      state.isAuthenticated = true
    },
    authorizeVerifyDevice: (state, action?) => {},
    authorizeVerifyDeviceFailure: (state, action) => {
      state.authorizeVerifyDevice = Remote.Failure(action.payload)
    },
    authorizeVerifyDeviceLoading: (state) => {
      state.authorizeVerifyDevice = Remote.Loading
    },
    authorizeVerifyDeviceSuccess: (state, action) => {
      state.authorizeVerifyDevice = Remote.Success(action.payload)
    },

    clearLoginError: (state) => {
      state.login = Remote.NotAsked
      state.exchangeAuth.exchangeLogin = Remote.NotAsked
    },
    continueLoginProcess: (state, action) => {},
    exchangeLogin: (state, action: PayloadAction<ExchangeLoginType>) => {},
    exchangeLoginFailure: (state, action: PayloadAction<ExchangeLoginFailureType>) => {
      state.exchangeAuth.exchangeLogin = Remote.Failure(action.payload)
    },
    exchangeLoginLoading: (state) => {
      state.exchangeAuth.exchangeLogin = Remote.Loading
    },
    exchangeLoginSuccess: (state, action: PayloadAction<ExchangeLoginSuccessType>) => {
      state.exchangeAuth.exchangeLogin = Remote.Success(action.payload)
    },
    exchangeResetPassword: (state, action: PayloadAction<string>) => {},
    exchangeResetPasswordFailure: (
      state,
      action: PayloadAction<ExchangeResetPasswordFailureType>
    ) => {
      state.exchangeAuth.resetPassword = Remote.Failure(action.payload)
    },
    exchangeResetPasswordLoading: (state) => {
      state.exchangeAuth.resetPassword = Remote.Loading
    },
    exchangeResetPasswordNotAsked: (state) => {
      state.exchangeAuth.resetPassword = Remote.NotAsked
    },
    exchangeResetPasswordSuccess: (
      state,
      action: PayloadAction<ExchangeResetPasswordSuccessType>
    ) => {
      state.exchangeAuth.resetPassword = Remote.Success(action.payload)
    },
    initializeLogin: () => {},
    initializeLoginFailure: () => {},
    initializeLoginLoading: () => {},
    initializeLoginSuccess: () => {},
    logWrongChangeCache: () => {},
    logWrongReceiveCache: () => {},
    login: (state, action) => {
      state.isLoggingIn = true
    },
    loginFailure: (state, action: PayloadAction<LoginFailureType>) => {
      state.login = Remote.Failure(action.payload)
    },
    loginLoading: (state) => {
      state.login = Remote.Loading
    },
    loginRoutine: (state, action: PayloadAction<LoginRoutinePayloadType>) => {},
    loginSuccess: (state, action: PayloadAction<LoginSuccessType>) => {
      state.login = Remote.Success(action.payload)
    },
    mobileLogin: (state, action) => {},
    mobileLoginFinish: (state) => {
      state.mobileLoginStarted = false
    },
    mobileLoginStarted: (state) => {
      state.mobileLoginStarted = true
    },
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
    resendSmsCode: (state, action) => {},
    resetAccount: (state, action) => {},
    resetAccountFailure: () => {},
    resetAccountLoading: () => {},
    resetAccountSuccess: () => {},
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
    secureChannelLoginFailure: (state, action: PayloadAction<string>) => {
      state.secureChannelLogin = Remote.Failure(action.payload)
    },
    secureChannelLoginLoading: (state) => {
      state.secureChannelLogin = Remote.Loading
    },
    secureChannelLoginNotAsked: (state) => {
      state.secureChannelLogin = Remote.NotAsked
    },
    secureChannelLoginSuccess: (state, action: PayloadAction<SecureChannelLoginType>) => {
      state.secureChannelLogin = Remote.Success(action.payload)
    },
    setAccountUnificationFlowType: (state, action: PayloadAction<AccountUnificationFlows>) => {
      state.accountUnificationFlow = action.payload
    },
    setAuthType: (state, action) => {
      state.auth_type = action.payload
    },
    setFirstLogin: (state, action: PayloadAction<AuthStateType['firstLogin']>) => {
      state.firstLogin = action.payload
    },
    setJwtToken: (state, action: PayloadAction<AuthStateType['exchangeAuth']['jwtToken']>) => {
      state.exchangeAuth.jwtToken = action.payload
    },
    setKycResetStatus: (state, action: PayloadAction<AuthStateType['kycReset']>) => {
      state.kycReset = action.payload
    },
    setMagicLinkInfo: (state, action: PayloadAction<AuthStateType['magicLinkData']>) => {
      state.magicLinkData = action.payload
    },
    setMagicLinkInfoEncoded: (
      state,
      action: PayloadAction<AuthStateType['magicLinkDataEncoded']>
    ) => {
      state.magicLinkDataEncoded = action.payload
    },
    setProductAuthMetadata: (state, action: PayloadAction<ProductAuthMetadata>) => {
      const { platform, product, redirect, userType } = action.payload
      state.productAuthMetadata = {
        platform: platform?.toUpperCase() as PlatformTypes,
        product: product?.toUpperCase() as ProductAuthOptions,
        redirect,
        userType
      }
    },
    setRegisterEmail: (state, action: PayloadAction<AuthStateType['registerEmail']>) => {
      state.registerEmail = action.payload
    },
    setResetAccount: (state, action: PayloadAction<AuthStateType['resetAccount']>) => {
      state.resetAccount = action.payload
    },
    setResetLogin: (state, action: PayloadAction<AuthStateType['resetAccount']>) => {
      state.resetAccount = action.payload
    },
    signupDetailsEntered: (state, action) => {},
    startLogoutTimer: () => {},
    triggerWalletMagicLink: (state, action) => {},
    triggerWalletMagicLinkFailure: () => {},
    triggerWalletMagicLinkLoading: () => {},
    triggerWalletMagicLinkNotAsked: () => {},
    triggerWalletMagicLinkSuccess: () => {}
  }
})

export const { actions } = authSlice
export const authReducer = authSlice.reducer
