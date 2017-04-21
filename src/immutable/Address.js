import * as R from 'ramda'
import * as crypto from '../WalletCrypto'
import { iLensProp } from '../Lens'
import { Map } from 'immutable'
import { typeGuard } from '../util'

/* Address :: {
  priv :: String
} */

function Address (x) {
  this.__internal = Map(x)
}

export const select = typeGuard(Address,
  (lens, address) => R.view(lens, address.__internal))

export const map = typeGuard(Address,
  (f, address) => new Address(f(address.__internal)))

export const priv = iLensProp('priv')

export const selectPriv = select(priv)

// encrypt :: Number -> String -> String -> Address -> Address
export const encrypt = R.curry((iterations, sharedKey, password, address) => {
  const cipher = crypto.encryptSecPass(sharedKey, iterations, password)
  return map(R.over(priv, cipher), address)
})

export default Address
