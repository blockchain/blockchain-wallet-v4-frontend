import { Map, fromJS as iFromJS } from 'immutable-ext'
import * as R from 'ramda'
import { typeDef, shift, shiftIProp } from '../util'
// import Bitcoin from 'bitcoinjs-lib'

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
export const xpub = define('xpub')

export const selectLabel = R.view(label)
export const selectArchived = R.view(archived)
export const selectXpriv = R.view(xpriv)
export const selectXpub = R.view(xpub)

export const isArchived = R.compose(Boolean, R.view(archived))
export const isActive = R.compose(R.not, isArchived)

export const fromJS = (x) => {
  if (x instanceof HDAccount) { return x }
  return new HDAccount(iFromJS(x))
}
export const toJS = R.pipe(guard, (acc) => acc.__internal.toJS())

// TODO :: maybe define address_labels and cache as it is own type
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
