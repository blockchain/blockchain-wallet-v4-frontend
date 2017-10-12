import { compose, is, equals, not, pipe, curry, isNil } from 'ramda'
import { view, set, traverseOf } from 'ramda-lens'
import * as crypto from '../walletCrypto'
import Either from 'data.either'
import Type from './Type'
import { iToJS } from './util'

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

export const isAddress = is(Address)

export const priv = Address.define('priv')
export const addr = Address.define('addr')
export const label = Address.define('label')
export const tag = Address.define('tag')
export const createdTime = Address.define('created_time')
export const createdDeviceName = Address.define('created_device_name')
export const createdDeviceVersion = Address.define('created_device_version')

export const selectPriv = view(priv)
export const selectAddr = view(addr)
export const selectLabel = view(label)
export const selectTag = view(tag)
export const selectCreatedTime = view(createdTime)
export const selectCreatedDeviceName = view(createdDeviceName)
export const selectCreatedDeviceVersion = view(createdDeviceVersion)

export const isArchived = compose(equals(2), view(tag))
export const isActive = compose(not, isArchived)
export const isWatchOnly = compose(isNil, view(priv))

export const fromJS = (x) => is(Address, x) ? x : new Address(x)

export const toJS = pipe(Address.guard, iToJS)

export const reviver = (jsObject) => {
  return new Address(jsObject)
}

// setLabel :: String -> Address -> Address
export const setLabel = set(label)

// archive :: Address -> Address
export const archive = set(tag, 2)

// unArchive :: Address -> Address
export const unArchive = set(tag, 0)

// encryptSync :: Number -> String -> String -> Address -> Either Error Address
export const encryptSync = curry((iterations, sharedKey, password, address) => {
  const cipher = crypto.encryptSecPassSync(sharedKey, iterations, password)
  return traverseOf(priv, Either.of, cipher, address)
})

// decryptSync :: Number -> String -> String -> Address -> Either Error Address
export const decryptSync = curry((iterations, sharedKey, password, address) => {
  const cipher = crypto.decryptSecPassSync(sharedKey, iterations, password)
  return traverseOf(priv, Either.of, cipher, address)
})
