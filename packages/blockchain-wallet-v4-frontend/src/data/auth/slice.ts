/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice } from '@reduxjs/toolkit'

import { Remote } from 'blockchain-wallet-v4/src'

const initialState = {
  auth_type: 0,
  firstLogin: false,
  isAuthenticated: false,
  isLoggingIn: false,
  kycReset: undefined,
  login: Remote.NotAsked,
  magicLinkData: null,
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
    authenticate: (state) => {
      state.isAuthenticated = true
    },
    clearLoginError: (state) => {
      state.login = Remote.NotAsked
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
    loginFailure: (state, action) => {
      state.login = Remote.Failure(action.payload)
    },
    loginIdEntered: (state, action) => {},
    loginLoading: (state) => {
      state.login = Remote.Loading
    },
    loginMethodSelected: (state, action) => {},
    loginPasswordDenied: () => {},
    loginPasswordEntered: () => {},
    loginRoutine: (state, action) => {},
    loginSuccess: (state, action) => {
      state.login = Remote.Success(action.payload)
    },
    loginTwoStepVerificationDenied: () => {},
    loginTwoStepVerificationEntered: () => {},
    magicLinkParsed: () => {},
    mobileLogin: (state, action) => {},
    mobileLoginFinish: (state) => {
      state.mobileLoginStarted = false
    },
    mobileLoginStarted: (state) => {
      state.mobileLoginStarted = true
    },
    needHelpClicked: (state, action) => {},
    pingManifestFile: () => {},
    recoveryOptionSelected: (state, action) => {},
    recoveryPhraseEntered: () => {},
    register: (state, action) => {},
    registerFailure: (state, action) => {
      state.registering = Remote.Failure(action.payload)
    },
    registerLoading: (state) => {
      state.registering = Remote.Loading
    },
    registerSuccess: (state, action) => {
      state.registering = Remote.Success(action.payload)
    },
    resendSmsCode: (state, action) => {},
    resetAccount: (state, action) => {},
    resetAccountCancelled: (state, action) => {},
    resetAccountClicked: (state, action) => {},
    resetAccountFailure: () => {},
    resetAccountLoading: () => {},
    resetAccountSuccess: () => {},
    restore: (state, action) => {},
    restoreFailure: () => {},
    restoreFromMetadata: (state, action) => {},
    restoreFromMetadataFailure: (state, action) => {
      state.metadataRestore = Remote.Failure(action.payload)
    },
    restoreFromMetadataLoading: (state) => {
      state.metadataRestore = Remote.Loading
    },
    restoreFromMetadataSuccess: (state, action) => {
      state.metadataRestore = Remote.Success(action.payload)
    },
    restoreLoading: (state) => {
      state.restoring = Remote.Loading
    },
    restoreSuccess: (state, action) => {
      state.restoring = Remote.Success(action.payload)
    },
    secureChannelLoginFailure: (state, action) => {
      state.secureChannelLogin = Remote.Failure(action.payload)
    },
    secureChannelLoginLoading: (state) => {
      state.secureChannelLogin = Remote.Loading
    },
    secureChannelLoginNotAsked: (state) => {
      state.secureChannelLogin = Remote.NotAsked
    },
    secureChannelLoginSuccess: (state, action) => {
      state.secureChannelLogin = Remote.Success(action.payload)
    },
    setAuthType: (state, action) => {
      state.auth_type = action.payload
    },
    setFirstLogin: (state, action) => {
      state.firstLogin = action.payload
    },
    setKycResetStatus: (state, action) => {
      state.kycReset = action.payload
    },
    setMagicLinkInfo: (state, action) => {
      state.magicLinkData = action.payload
    },
    setManifestFile: (state, action) => {
      state.manifestFile = action.payload
    },
    setRegisterEmail: (state, action) => {
      state.registerEmail = action.payload
    },
    setResetAccount: (state, action) => {},
    setResetLogin: (state, action) => {
      state.resetAccount = action.payload
    },
    setUserGeoLocation: (state, action) => {
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
