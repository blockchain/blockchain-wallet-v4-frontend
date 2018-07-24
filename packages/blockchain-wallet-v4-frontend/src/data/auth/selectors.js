import { path } from 'ramda'

export const isAuthenticated = path(['auth', 'isAuthenticated'])
export const getRegistering = path(['auth', 'registering'])
export const getRestoring = path(['auth', 'restoring'])
export const getAuthType = path(['auth', 'auth_type'])
export const getReset2fa = path(['auth', 'reset_2fa'])
export const getLogin = path(['auth', 'login'])
