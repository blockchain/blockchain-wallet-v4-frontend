import { WALLET_IMMUTABLE_PATH } from '../config'

export const getSession = guid => state => state.session[guid]
export const getWallet = state => state[WALLET_IMMUTABLE_PATH]
