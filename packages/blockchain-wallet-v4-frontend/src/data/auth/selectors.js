import { path } from 'ramda'

export const isAuthenticated = path(['auth', 'isAuthenticated'])
export const getAuthType = path(['auth', 'auth_type'])
