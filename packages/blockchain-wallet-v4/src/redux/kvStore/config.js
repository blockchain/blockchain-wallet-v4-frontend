export const BCH = 'bch'
export const BTC = 'btc'
export const ETH = 'eth'
export const LOCKBOX = 'lockbox' // Deprecated
export const ROOT = 'root'
export const USER_CREDENTIALS = 'userCredentials'
export const XLM = 'xlm'
export const WALLET_CREDENTIALS = 'walletCredentials'

/* eslint-disable */
export const derivationMap = {
  [ROOT]: -1,
  ['whatsNew']: 2, // Deprecated
  ['buySell']: 3, // Deprecated
  ['contacts']: 4, // Deprecated
  [ETH]: 5,
  ['shapeshift']: 6, // Deprecated
  [BCH]: 7,
  [BTC]: 8,
  [LOCKBOX]: 9, // Deprecated
  [USER_CREDENTIALS]: 10,
  [XLM]: 11,
  [WALLET_CREDENTIALS]: 12
}
/* eslint-enable */
