// -- EXPOSE AUTHENTICATION ACTIONS -- //
import * as AT from './actionTypes'

export const login = (guid, password, code, sharedKey) => ({ type: AT.LOGIN, payload: { guid, password, code, sharedKey } })

export const storeWalletPayload = (wallet) => ({ type: AT.STORE_WALLET_PAYLOAD, payload: { wallet }})
