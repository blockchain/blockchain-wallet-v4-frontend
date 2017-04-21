import { Map } from 'immutable-ext'
import * as R from 'ramda'
import { iLensProp } from '../lens'
import { typeDef } from '../util'

/* HDWallet :: {
  seed_hex :: String
  accounts :: [Account]
} */

function HDWallet (x) {
  this.__internal = Map(x)
}

const { guard, define } = typeDef(HDWallet)

export const seedHex = define('seed_hex')
export const accounts = define('accounts')
export const xpriv = iLensProp('xpriv')

export const toJS = R.pipe(guard, (hd) => {
  return hd.__internal.toJS()
})

export default HDWallet
