export const BCH = 'bch'
export const BUYSELL = 'buySell' // Deprecated
export const BTC = 'btc'
export const CONTACTS = 'contacts' // Deprecated
export const ETH = 'eth'
export const LOCKBOX = 'lockbox'
export const ROOT = 'root'
export const SHAPESHIFT = 'shapeshift' // Deprecated
export const WHATSNEW = 'whatsNew' // Deprecated
export const USER_CREDENTIALS = 'userCredentials'
export const XLM = 'xlm'
export const WALLET_CREDENTIALS = 'walletCredentials'

export const derivationMap = {
  [ROOT]: -1,
  [WHATSNEW]: 2, // Deprecated
  [BUYSELL]: 3, // Deprecated
  [CONTACTS]: 4, // Deprecated
  [ETH]: 5,
  [SHAPESHIFT]: 6, // Deprecated
  [BCH]: 7,
  [BTC]: 8,
  [LOCKBOX]: 9,
  [USER_CREDENTIALS]: 10,
  [XLM]: 11,
  [WALLET_CREDENTIALS]: 12
}
