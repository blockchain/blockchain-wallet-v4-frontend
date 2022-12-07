/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Remote } from '@core'
import { RemoteDataType } from '@core/remote/types'

import {
  AccountUnificationFlows,
  AuthStateType,
  AuthUserType,
  ExchangeLoginFailureType,
  ExchangeLoginSuccessType,
  ExchangeLoginType,
  ExchangeResetPasswordSuccessType,
  LoginFailureType,
  LoginPayloadType,
  LoginSuccessType,
  MagicLinkRequestPayloadType,
  PlatformTypes,
  ProductAuthMetadata,
  ProductAuthOptions
} from './types'

const initialState: AuthStateType = {
  auth_type: 0,
  authorizeVerifyDevice: Remote.NotAsked,
  exchangeAuth: {
    exchangeLogin: Remote.NotAsked,
    resetPassword: Remote.NotAsked
  },
  isAuthenticated: false,
  isLoggingIn: false,
  login: Remote.NotAsked,
  manifestFile: null,
  mobileLoginStarted: false,
  productAuthMetadata: {
    platform: PlatformTypes.WEB
  },
  resetAccount: false,
  secureChannelLogin: Remote.NotAsked
}

const authSlice = createSlice({
  initialState,
  name: 'auth',
  reducers: {
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
    exchangeResetPassword: (state, action: PayloadAction<string>) => {},
    exchangeResetPasswordFailure: (state) => {
      state.exchangeAuth.resetPassword = Remote.Failure(null)
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
    login: (state, action: PayloadAction<LoginPayloadType>) => {
      state.isLoggingIn = true
    },
    loginFailure: (state, action: PayloadAction<LoginFailureType>) => {
      state.login = Remote.Failure(action.payload)
    },
    loginLoading: (state) => {
      state.login = Remote.Loading
    },
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
    resendSmsCode: (state, action: PayloadAction<{ email?: string; guid?: string }>) => {},
    secureChannelLoginFailure: (state, action: PayloadAction<string>) => {
      state.secureChannelLogin = Remote.Failure(action.payload)
    },
    secureChannelLoginLoading: (state) => {
      state.secureChannelLogin = Remote.Loading
    },
    secureChannelLoginNotAsked: (state) => {
      state.secureChannelLogin = Remote.NotAsked
    },
    secureChannelLoginSuccess: (
      state,
      action: PayloadAction<RemoteDataType<string, undefined>>
    ) => {
      state.secureChannelLogin = action.payload
    },
    sendLoginMessageToMobile: () => {},
    setAccountUnificationFlowType: (state, action: PayloadAction<AccountUnificationFlows>) => {
      state.accountUnificationFlow = action.payload
    },
    setAuthType: (state, action) => {
      state.auth_type = action.payload
    },
    setExchangeAccountConflict: (
      state,
      action: PayloadAction<AuthStateType['exchangeAuth']['exchangeAccountConflict']>
    ) => {
      state.exchangeAuth.exchangeAccountConflict = action.payload
    },
    setExchangeAccountCreationFailure: (
      state,
      action: PayloadAction<AuthStateType['exchangeAuth']['exchangeAccountFailure']>
    ) => {
      state.exchangeAuth.exchangeAccountFailure = action.payload
    },
    setJwtToken: (state, action: PayloadAction<AuthStateType['exchangeAuth']['jwtToken']>) => {
      state.exchangeAuth.jwtToken = action.payload
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
      const { platform, product, redirect, sessionIdMobile, userType } = action.payload
      state.productAuthMetadata = {
        platform: platform?.toUpperCase() as PlatformTypes,
        product: product?.toUpperCase() as ProductAuthOptions,
        redirect,
        sessionIdMobile,
        userType: userType?.toUpperCase() as AuthUserType
      }
    },
    startLogoutTimer: () => {},
    triggerWalletMagicLink: (state, action: PayloadAction<MagicLinkRequestPayloadType>) => {}
  }
})

export const { actions } = authSlice
export const authReducer = authSlice.reducer
