import { path } from 'ramda'

import { RootState } from 'data/rootReducer'

import { AuthStateType } from './types'

export const isAuthenticated: (state: RootState) => AuthStateType['isAuthenticated'] | undefined =
  path(['auth', 'isAuthenticated'])
export const getRegistering: (state: RootState) => AuthStateType['registering'] = path([
  'auth',
  'registering'
])
export const getFirstLogin: (state: RootState) => AuthStateType['firstLogin'] | undefined = path([
  'auth',
  'firstLogin'
])
export const getRestoring: (state: RootState) => AuthStateType['restoring'] = path([
  'auth',
  'restoring'
])
export const getAuthType: (state: RootState) => AuthStateType['auth_type'] | undefined = path([
  'auth',
  'auth_type'
])
export const getDesignatedProduct: (
  state: RootState
) => AuthStateType['designatedProduct'] | undefined = path(['auth', 'designatedProduct'])
export const getSecureChannelLogin: (state: RootState) => AuthStateType['secureChannelLogin'] =
  path(['auth', 'secureChannelLogin'])
export const getLogin: (state: RootState) => AuthStateType['login'] = path(['auth', 'login'])
export const getMobileLoginStarted: (
  state: RootState
) => AuthStateType['mobileLoginStarted'] | undefined = path(['auth', 'mobileLoginStarted'])
export const getRegisterEmail: (state: RootState) => AuthStateType['registerEmail'] = path([
  'auth',
  'registerEmail'
])
export const getMetadataRestore: (state: RootState) => AuthStateType['metadataRestore'] = path([
  'auth',
  'metadataRestore'
])
export const getKycResetStatus: (state: RootState) => AuthStateType['kycReset'] = path([
  'auth',
  'kycReset'
])
export const getAccountReset: (state: RootState) => AuthStateType['resetAccount'] | undefined =
  path(['auth', 'resetAccount'])
export const getMagicLinkData = (state: RootState) => state.auth.magicLinkData
export const getUserGeoData: (state: RootState) => AuthStateType['userGeoData'] = path([
  'auth',
  'userGeoData'
])
export const getManifest: (state: RootState) => AuthStateType['manifestFile'] = path([
  'auth',
  'manifestFile'
])
