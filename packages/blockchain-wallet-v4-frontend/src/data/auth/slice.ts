import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Remote } from '@core'
import { ExchangeErrorCodes } from 'data/types'

import {
  AccountUnificationFlows,
  AuthStateType,
  ExchangeLoginFailureType,
  ExchangeLoginSuccessType,
  ExchangeLoginType,
  LoginFailureType,
  LoginSuccessType,
  MetadataRestoreType,
  PlatformTypes,
  ProductAuthOptions,
  RegisteringFailureType,
  RegisteringSuccessType,
  RestoringType,
  SecureChannelLoginType
} from './types'

const initialState: AuthStateType = {
  accountUnificationFlow: undefined,
  authPlatform: PlatformTypes.WEB,
  auth_type: 0,
  designatedProduct: ProductAuthOptions.WALLET,
  designatedProductRedirect: undefined,
  exchangeAuth: {
    exchangeLogin: Remote.NotAsked,
    exchangeLoginError: undefined,
    jwtToken: undefined
  },
  firstLogin: false,
  isAuthenticated: false,
  isLoggingIn: false,
  kycReset: undefined,
  login: Remote.NotAsked,
  magicLinkData: undefined,
  manifestFile: null,
  metadataRestore: Remote.NotAsked,
  mobileLoginStarted: false,
  registerEmail: undefined,
  registering: Remote.NotAsked,
  resetAccount: false,
  restoring: Remote.NotAsked,
  secureChannelLogin: Remote.NotAsked,
  userGeoData: Remote.NotAsked
}

const authSlice = createSlice({
  initialState,
  name: 'auth',
  reducers: {
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
    clearLoginError: (state) => {
      state.login = Remote.NotAsked
      state.exchangeAuth.exchangeLogin = Remote.NotAsked
    },
    continueLoginProcess: () => {},
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
    getUserGeoLocation: () => {},
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
    loginRoutine: () => {},
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
    pingManifestFile: () => {},
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
    setAuthPlatform: (state, action: PayloadAction<string | null>) => {
      const platform = action.payload
      if (platform && platform.toUpperCase() === PlatformTypes.ANDROID) {
        state.authPlatform = PlatformTypes.ANDROID
      } else if (platform && platform.toUpperCase() === PlatformTypes.IOS) {
        state.authPlatform = PlatformTypes.IOS
      } else state.authPlatform = PlatformTypes.WEB
    },
    setAuthType: (state, action) => {
      state.auth_type = action.payload
    },
    setDesignatedProductMetadata: (
      state,
      action: PayloadAction<{
        designatedProduct?: string | null
        designatedProductRedirect?: AuthStateType['designatedProductRedirect'] | null
      }>
    ) => {
      const { designatedProduct, designatedProductRedirect } = action.payload
      // TODO: update to check for explorer when applicable
      if (designatedProduct && designatedProduct.toUpperCase() === ProductAuthOptions.WALLET) {
        state.designatedProduct = ProductAuthOptions.WALLET
      } else if (
        designatedProduct &&
        designatedProduct.toUpperCase() === ProductAuthOptions.EXCHANGE
      ) {
        state.designatedProduct = ProductAuthOptions.EXCHANGE
      }
      if (typeof designatedProductRedirect === 'string') {
        state.designatedProductRedirect = designatedProductRedirect
      }
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
    setManifestFile: (state, action: PayloadAction<AuthStateType['manifestFile']>) => {
      state.manifestFile = action.payload
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
    setUserGeoLocation: (state, action: PayloadAction<AuthStateType['userGeoData']>) => {
      state.userGeoData = action.payload
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
