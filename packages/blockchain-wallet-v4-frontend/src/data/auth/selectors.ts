import { path } from 'ramda'

import { RootState } from 'data/rootReducer'

import { WalletDataFromMagicLink } from './types'

export const isAuthenticated = path(['auth', 'isAuthenticated'])
export const getRegistering = path(['auth', 'registering'])
export const getFirstLogin = path(['auth', 'firstLogin'])
export const getRestoring = path(['auth', 'restoring'])
export const getAuthType = path(['auth', 'auth_type'])
export const getSecureChannelLogin = path(['auth', 'secureChannelLogin'])
export const getLogin = path(['auth', 'login'])
export const getMobileLoginStarted = path(['auth', 'mobileLoginStarted'])
export const getRegisterEmail = path(['auth', 'registerEmail'])
export const getMetadataRestore = path(['auth', 'metadataRestore'])
export const getKycResetStatus = path(['auth', 'kycReset'])
export const getAccountReset = path(['auth', 'resetAccount'])
export const getMagicLinkData = (state: RootState): WalletDataFromMagicLink | null =>
  state.auth.magicLinkData
export const getUserGeoData = path(['auth', 'userGeoData'])