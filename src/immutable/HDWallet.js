import { Map } from 'immutable-ext'
import * as R from 'ramda'
import { iLensProp } from '../lens'
import { typeGuard, typeLens, defineLensProps } from '../util'

/* HDWallet :: {
  seed_hex :: String
  accounts :: [Account]
} */

function HDWallet (x) {
  this.__internal = Map(x)
}

const lens = typeLens(HDWallet)
const guard = typeGuard(HDWallet)
const define = defineLensProps(lens)

export const seedHex = define('seed_hex')
export const accounts = define('accounts')
export const xpriv = iLensProp('xpriv')

export const toJS = R.pipe(guard, (hd) => {
  return hd.__internal.toJS()
})

export default HDWallet
