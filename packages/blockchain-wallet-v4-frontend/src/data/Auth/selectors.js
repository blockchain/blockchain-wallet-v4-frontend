import { path } from 'ramda'

export const getIsAuthenticated = path(['application', 'auth', 'isAuthenticated'])
export const getAuthType = path(['application', 'auth', 'authType'])
