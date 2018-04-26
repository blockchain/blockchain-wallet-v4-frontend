import { path } from 'ramda'

export const getReset2faError = path(['auth', 'reset_2fa_error'])
export const isAuthenticated = path(['auth', 'isAuthenticated'])
export const getRegistering = path(['auth', 'registering'])
export const getRestoring = path(['auth', 'restoring'])
export const getAuthType = path(['auth', 'auth_type'])
export const getLogin = path(['auth', 'login'])
