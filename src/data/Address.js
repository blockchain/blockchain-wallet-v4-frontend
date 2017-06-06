import * as R from 'ramda'
import * as crypto from '../WalletCrypto'
import { Map } from 'immutable-ext'
import { traverseOf } from 'ramda-lens'
import Either from 'data.either'
import { typeDef } from '../util'

/* Address :: {
  priv :: String
  addr :: String
  label :: String
  tag :: Number
  created_time :: Number
  created_device_name :: String
  created_device_version :: String
} */

function Address (x) {
  this.__internal = Map(x)
}

const { guard, define } = typeDef(Address)

export const priv = define('priv')
export const addr = define('addr')
export const label = define('label')
export const tag = define('tag')
export const createdTime = define('created_time')
export const createdDeviceName = define('created_device_name')
export const createdDeviceVersion = define('created_device_version')

export const selectPriv = R.view(priv)
export const selectAddr = R.view(addr)
export const selectLabel = R.view(label)
export const selectTag = R.view(tag)
export const selectCreatedTime = R.view(createdTime)
export const selectCreatedDeviceName = R.view(createdDeviceName)
export const selectCreatedDeviceVersion = R.view(createdDeviceVersion)

export const fromJS = (x) => {
  return new Address(x)
}

export const toJS = R.pipe(guard, (address) => {
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
