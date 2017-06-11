import { path } from 'ramda'
import { WALLET_IMMUTABLE_PATH } from 'config'

// I think this two selectors are not where they are suppossed to be
export const getWallet = state => state[WALLET_IMMUTABLE_PATH]
export const getSession = guid => state => state.session[guid]

export const isAuthenticated = path(['applicationState', 'auth', 'isAuthenticated'])
