import { Map, fromJS as iFromJS } from 'immutable-ext'
import * as R from 'ramda'
import { iLensProp } from '../lens'
import { typeDef, shift, shiftIProp } from '../util'

/* HDWallet :: {
  seed_hex :: String
  accounts :: [Account]
} */

function HDWallet (x) {
  this.__internal = Map(x)
}

const { guard, define } = typeDef(HDWallet)

export const seedHex = define('seedHex')
export const accounts = define('accounts')
export const xpriv = iLensProp('xpriv')

const shiftHDWallet = R.compose(shiftIProp('seed_hex', 'seedHex'), shift)

export const fromJS = (x) => {
  return new HDWallet(shiftHDWallet(iFromJS(x)).forward())
}

export const toJS = R.pipe(guard, (hd) => {
  return shiftHDWallet(hd.__internal).back().toJS()
})

export default HDWallet
