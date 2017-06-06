import { Map, fromJS as iFromJS } from 'immutable-ext'
import * as R from 'ramda'
// import { iLensProp } from '../lens'
import { typeDef, shift, shiftIProp } from '../util'
// import Bitcoin from 'bitcoinjs-lib'
// import BIP39 from 'bip39'

/* HDAccount :: {
  label :: String
  ...
} */
const DEFAULT_LABEL = 'My Bitcoin Wallet'

function HDAccount (x) {
  this.__internal = Map(x)
}

const { guard, define } = typeDef(HDAccount)

export const label = define('label')
export const archived = define('archived')
export const xpriv = define('xpriv')

export const fromJS = (x) => new HDAccount(iFromJS(x))

export const toJS = R.pipe(guard, (acc) => acc.__internal.toJS())

export const createNew = R.curry((accountNode, { label = DEFAULT_LABEL } = {}) => {
  return fromJS({
    label,
    archived: false,
    xpriv: accountNode.toBase58(),
    xpub: accountNode.neutered().toBase58(),
    address_labels: [],
    cache: {
      receiveAccount: accountNode.derive(0).neutered().toBase58(),
      changeAccount: accountNode.derive(1).neutered().toBase58()
    }
  })
})
