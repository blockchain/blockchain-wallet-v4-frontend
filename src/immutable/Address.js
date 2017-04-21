import * as R from 'ramda'
import * as crypto from '../WalletCrypto'
import { iLensProp } from '../Lens'
import { Map } from 'immutable'
import { typeLens, typeError } from '../util'

/* Address :: {
  priv :: String
  addr :: String
} */

function Address (x) {
  this.__internal = Map(x)
}

export const lens = typeLens(Address)

export const priv = R.compose(lens, iLensProp('priv'))
export const addr = R.compose(lens, iLensProp('addr'))

export const selectPriv = R.view(priv)
export const selectAddr = R.view(addr)

export const toJS = (address) => {
  if (R.is(Address, address)) {
    return address.__internal.toJS()
  } else {
    throw typeError(Address, address)
  }
}

// encrypt :: Number -> String -> String -> Address -> Address
export const encrypt = R.curry((iterations, sharedKey, password, address) => {
  const cipher = crypto.encryptSecPass(sharedKey, iterations, password)
  return R.over(priv, cipher, address)
})

export default Address
