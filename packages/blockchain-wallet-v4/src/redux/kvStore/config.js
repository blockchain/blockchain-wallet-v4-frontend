export const BCH = 'bch'
export const BUYSELL = 'buySell' // Deprecated
export const BTC = 'btc'
export const CONTACTS = 'contacts' // Deprecated
export const ETH = 'eth'
export const LOCKBOX = 'lockbox' // Deprecated
export const ROOT = 'root'
export const SHAPESHIFT = 'shapeshift' // Deprecated
export const WHATSNEW = 'whatsNew' // Deprecated
export const UNIFIED_CREDENTIALS = 'unifiedCredentials'
export const USER_CREDENTIALS = 'userCredentials' // Deprecated
export const XLM = 'xlm'
export const WALLET_CONNECT = 'walletConnect'
export const WALLET_CREDENTIALS = 'walletCredentials'

/* eslint-disable sort-keys, sort-keys-fix/sort-keys-fix */
export const derivationMap = {
  [ROOT]: -1,
  [WHATSNEW]: 2, // Deprecated
  [BUYSELL]: 3, // Deprecated
  [CONTACTS]: 4, // Deprecated
  [ETH]: 5,
  [SHAPESHIFT]: 6, // Deprecated
  [BCH]: 7,
  [BTC]: 8,
  [USER_CREDENTIALS]: 10, // Deprecated
  [XLM]: 11,
  [WALLET_CREDENTIALS]: 12,
  [WALLET_CONNECT]: 13, // Not used by web
  [UNIFIED_CREDENTIALS]: 14
}
