import { path } from 'ramda'

export const isAuthenticated = path(['application', 'auth', 'isAuthenticated'])
export const getAuthType = path(['application', 'auth', 'authType'])
