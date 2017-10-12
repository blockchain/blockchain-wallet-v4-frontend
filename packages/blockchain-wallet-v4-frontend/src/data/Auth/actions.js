import * as AT from './actionTypes'

export const login = (guid, password, code, sharedKey) => ({ type: AT.LOGIN, payload: { guid, password, code, sharedKey } })

export const mobileLogin = (data) => ({ type: AT.MOBILE_LOGIN, payload: { data } })

export const setAuthType = (authType) => ({ type: AT.SET_AUTH_TYPE, payload: { authType } })

export const register = (email, password) => ({ type: AT.REGISTER, payload: { email, password } })

export const restore = (mnemonic, email, password, network) => ({ type: AT.RESTORE, payload: { mnemonic, email, password, network } })

export const remindGuid = (email, code, sessionToken) => ({ type: AT.REMIND_GUID, payload: { email, code, sessionToken } })

export const authenticate = () => ({ type: AT.AUTHENTICATE })

export const logout = () => ({ type: AT.LOGOUT })

export const logoutResetTimer = () => ({ type: AT.LOGOUT_RESET_TIMER })
