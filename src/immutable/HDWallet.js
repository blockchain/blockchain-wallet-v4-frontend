import { Map, fromJS as iFromJS } from 'immutable-ext'
import * as R from 'ramda'
import { iLensProp } from '../lens'
import { typeDef, iRename } from '../util'

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

export const fromJS = (x) => {
  let renameProps = iRename('seed_hex', 'seedHex')
  return new HDWallet(renameProps(iFromJS(x)))
}

export const toJS = R.pipe(guard, (hd) => {
  let renameProps = iRename('seedHex', 'seed_hex')
  return renameProps(hd.__internal).toJS()
})

export default HDWallet
