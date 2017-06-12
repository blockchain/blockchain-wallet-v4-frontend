import * as R from 'ramda'
import * as crypto from '../WalletCrypto'
import { traverseOf } from 'ramda-lens'
import Either from 'data.either'
import Type from './Type'

/* Address :: {
  priv :: String
  addr :: String
  label :: String
  tag :: Number
  created_time :: Number
  created_device_name :: String
  created_device_version :: String
} */

export class Address extends Type {}

export const priv = Address.define('priv')
export const addr = Address.define('addr')
export const label = Address.define('label')
export const tag = Address.define('tag')
export const createdTime = Address.define('created_time')
export const createdDeviceName = Address.define('created_device_name')
export const createdDeviceVersion = Address.define('created_device_version')

export const selectPriv = R.view(priv)
export const selectAddr = R.view(addr)
export const selectLabel = R.view(label)
export const selectTag = R.view(tag)
export const selectCreatedTime = R.view(createdTime)
export const selectCreatedDeviceName = R.view(createdDeviceName)
export const selectCreatedDeviceVersion = R.view(createdDeviceVersion)

export const isArchived = R.compose(Boolean, R.equals(2), R.view(tag))
export const isActive = R.compose(R.not, isArchived)

export const fromJS = (x) => {
  if (x instanceof Address) { return x }
  return new Address(x)
}

export const toJS = R.pipe(Address.guard, (address) => {
  return address.__internal.toJS()
})

// setLabel :: String -> Address -> Address
export const setLabel = R.set(label)

// archive :: Address -> Address
export const archive = R.set(tag, 2)

// unArchive :: Address -> Address
export const unArchive = R.set(tag, 0)

// encryptSync :: Number -> String -> String -> Address -> Either Error Address
export const encryptSync = R.curry((iterations, sharedKey, password, address) => {
  const cipher = crypto.encryptSecPassSync(sharedKey, iterations, password)
  return traverseOf(priv, Either.of, cipher, address)
})

// decryptSync :: Number -> String -> String -> Address -> Either Error Address
export const decryptSync = R.curry((iterations, sharedKey, password, address) => {
  const cipher = crypto.decryptSecPassSync(sharedKey, iterations, password)
  return traverseOf(priv, Either.of, cipher, address)
})
