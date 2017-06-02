import * as R from 'ramda'
import * as crypto from '../WalletCrypto'
import { Map } from 'immutable'
import { traverseOf } from 'ramda-lens'
import Either from 'data.either'
import { typeDef } from '../util'

/* Address :: {
  priv :: String
  addr :: String
} */

function Address (x) {
  this.__internal = Map(x)
}

const { guard, define } = typeDef(Address)

export const priv = define('priv')
export const addr = define('addr')
export const label = define('label')

export const selectPriv = R.view(priv)
export const selectAddr = R.view(addr)

export const fromJS = (x) => {
  return new Address(x)
}

export const toJS = R.pipe(guard, (address) => {
  return address.__internal.toJS()
})

// setLabel :: String -> Address -> Address
export const setLabel = R.curry((l, address) => {
  return R.set(label, l, address)
})

// encryptSync :: Number -> String -> String -> Address -> Either Error Address
export const encryptSync = R.curry((iterations, sharedKey, password, address) => {
  const cipher = crypto.encryptSecPassSync(sharedKey, iterations, password)
  return traverseOf(priv, Either.of, cipher, address)
})

export default Address
