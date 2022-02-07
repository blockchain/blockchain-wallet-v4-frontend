import { RootState } from 'data/rootReducer'

import { AuthStateType } from './types'

// TODO: organize these functions
export function getAccountReset(state: RootState): AuthStateType['resetAccount'] {
  return state.auth.resetAccount
}

export function getAccountUnificationFlowType(
  state: RootState
): AuthStateType['accountUnificationFlow'] {
  return state.auth.accountUnificationFlow
}

export function getAuthType(state: RootState): AuthStateType['auth_type'] {
  return state.auth.auth_type
}

export function getRegistering(state: RootState): AuthStateType['registering'] {
  return state.auth.registering
}

export function getFirstLogin(state: RootState): AuthStateType['firstLogin'] {
  return state.auth.firstLogin
}

export function getRestoring(state: RootState): AuthStateType['restoring'] {
  return state.auth.restoring
}

export function getProductAuthMetadata(state: RootState): AuthStateType['productAuthMetadata'] {
  return state.auth.productAuthMetadata
}

export function getProduct(state: RootState): AuthStateType['productAuthMetadata']['product'] {
  return state.auth.productAuthMetadata.product
}

export function getSecureChannelLogin(state: RootState): AuthStateType['secureChannelLogin'] {
  return state.auth.secureChannelLogin
}

export function getExchangeLogin(state: RootState): AuthStateType['exchangeAuth']['exchangeLogin'] {
  return state.auth.exchangeAuth.exchangeLogin
}

export function getLogin(state: RootState): AuthStateType['login'] {
  return state.auth.login
}

export function getMobileLoginStarted(state: RootState): AuthStateType['mobileLoginStarted'] {
  return state.auth.mobileLoginStarted
}

export function getRegisterEmail(state: RootState): AuthStateType['registerEmail'] {
  return state.auth.registerEmail
}

export function getMetadataRestore(state: RootState): AuthStateType['metadataRestore'] {
  return state.auth.metadataRestore
}

export function getKycResetStatus(state: RootState): AuthStateType['kycReset'] {
  return state.auth.kycReset
}

export function getMagicLinkData(state: RootState): AuthStateType['magicLinkData'] {
  return state.auth.magicLinkData
}

export function getManifest(state: RootState): AuthStateType['manifestFile'] {
  return state.auth.manifestFile
}

export function isAuthenticated(state: RootState): AuthStateType['isAuthenticated'] {
  return state.auth.isAuthenticated
}

export function getJwtToken(state: RootState): AuthStateType['exchangeAuth']['jwtToken'] {
  return state.auth.exchangeAuth.jwtToken
}
export const getMagicLinkDataEncoded = (state: RootState) => state.auth.magicLinkDataEncoded
export const getAuthorizeVerifyDevice = (state: RootState) => state.auth.authorizeVerifyDevice

export function getExchangeResetPassword(
  state: RootState
): AuthStateType['exchangeAuth']['resetPassword'] {
  return state.auth.exchangeAuth.resetPassword
}
