import { compose, is, equals, not, pipe, curry, isNil } from 'ramda'
import { view, set, traverseOf } from 'ramda-lens'
import Base58 from 'bs58'
import { ECPair } from 'bitcoinjs-lib'
import * as crypto from '../walletCrypto'
import { parseBIP38toECPair } from '../walletCrypto/importExport'
import Either from 'data.either'
import Task from 'data.task'
import Type from './Type'
import { iToJS } from './util'
import * as utils from '../utils'

const eitherToTask = e => e.fold(Task.rejected, Task.of)
const wrapPromiseInTask = fP =>
  new Task((reject, resolve) => fP().then(resolve, reject))

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

export const isArchived = compose(
  equals(2),
  view(tag)
)
export const isActive = compose(
  not,
  isArchived
)
export const isWatchOnly = compose(
  isNil,
  view(priv)
)
export const isNotWatchOnly = compose(
  not,
  isWatchOnly
)

export const fromJS = x => (is(Address, x) ? x : new Address(x))

export const toJS = pipe(
  Address.guard,
  iToJS
)

export const reviver = jsObject => {
  return new Address(jsObject)
}

// setLabel :: String -> Address -> Address
export const setLabel = set(label)

// archive :: Address -> Address
export const archive = set(tag, 2)

// unArchive :: Address -> Address
export const unArchive = set(tag, 0)

export const setArchived = curry((archived, address) =>
  set(tag, archived ? 2 : 0, address)
)

// encrypt :: Number -> String -> String -> Address -> Task Error Address
export const encrypt = curry((iterations, sharedKey, password, address) => {
  const cipher = crypto.encryptSecPass(sharedKey, iterations, password)
  return traverseOf(priv, Task.of, cipher, address)
})

// decrypt :: Number -> String -> String -> Address -> Task Error Address
export const decrypt = curry((iterations, sharedKey, password, address) => {
  const cipher = crypto.decryptSecPass(sharedKey, iterations, password)
  return traverseOf(priv, Task.of, cipher, address)
})

// importAddress :: String|ECPair -> String? -> Number -> Network -> Address
export const importAddress = (key, createdTime, label, network) => {
  let object = {
    priv: null,
    addr: null,
    label: label,
    tag: 0,
    created_time: createdTime,
    created_device_name: 'wallet-web',
    created_device_version: 'v4'
  }

  switch (true) {
    case utils.bitcoin.isValidBitcoinAddress(key, network):
      object.addr = key
      object.priv = null
      break
    case utils.bitcoin.isKey(key):
      object.addr = key.getAddress()
      object.priv = Base58.encode(key.d.toBuffer(32))
      break
    case utils.bitcoin.isValidBitcoinPrivateKey(key, network):
      key = ECPair.fromWIF(key, network)
      object.addr = key.getAddress()
      object.priv = Base58.encode(key.d.toBuffer(32))
      break
    default:
      throw new Error('unsupported_address_import_format')
  }

  return fromJS(object)
}

// fromString :: String -> Number -> String? -> String? -> { Network, API } -> Task Error Address
export const fromString = (
  keyOrAddr,
  createdTime,
  label,
  bipPass,
  { network, api }
) => {
  if (utils.bitcoin.isValidBitcoinAddress(keyOrAddr)) {
    return Task.of(importAddress(keyOrAddr, createdTime, label, network))
  } else {
    let format = utils.bitcoin.detectPrivateKeyFormat(keyOrAddr)
    let okFormats = ['base58', 'base64', 'hex', 'mini', 'sipa', 'compsipa']
    if (format === 'bip38') {
      if (bipPass == null || bipPass === '') {
        return Task.rejected(new Error('needs_bip38'))
      }
      let tryParseBIP38toECPair = Either.try(parseBIP38toECPair)
      let keyE = tryParseBIP38toECPair(keyOrAddr, bipPass, network)
      return eitherToTask(keyE).map(key =>
        importAddress(key, createdTime, label, network)
      )
    } else if (format === 'mini' || format === 'base58') {
      let key
      try {
        key = utils.bitcoin.privateKeyStringToKey(keyOrAddr, format)
      } catch (e) {
        return Task.rejected(e)
      }
      key.compressed = true
      let cad = key.getAddress()
      key.compressed = false
      let uad = key.getAddress()
      return wrapPromiseInTask(() => api.getBalances([cad, uad])).fold(
        e => {
          key.compressed = true
          return importAddress(key, createdTime, label, network)
        },
        o => {
          let compBalance = o[cad].final_balance
          let ucompBalance = o[uad].final_balance
          key.compressed = !(compBalance === 0 && ucompBalance > 0)
          return importAddress(key, createdTime, label, network)
        }
      )
    } else if (okFormats.indexOf(format) > -1) {
      let key = utils.bitcoin.privateKeyStringToKey(keyOrAddr, format)
      return Task.of(importAddress(key, createdTime, label, network))
    } else {
      return Task.rejected(new Error('unknown_key_format'))
    }
  }
}
