/* eslint-disable */
import BIP39 from 'bip39'
import * as Bitcoin from 'bitcoinjs-lib'
import BitcoinMessage from 'bitcoinjs-message'
import Either from 'data.either'
import { assoc, compose, curry, is, isNil, prop } from 'ramda'
import { view } from 'ramda-lens'

import { keyPairToAddress } from '../utils/btc'
import * as crypto from '../walletCrypto'
import * as U from '../walletCrypto/utils'
import Type from './Type'

/*
Payload types:
0: reserved (guid)
1: reserved
2: whatsNew // TODO: Deprecate
3: buy-sell
4: contacts
*/

export class KVStoreEntry extends Type {
  // toString () {
  //   return `KV(${this.typeId} | ${this.address} | ${JSON.stringify(this.value, null, 2)})`
  // }
}
export const isKVStoreEntry = is(KVStoreEntry)

export const VERSION = KVStoreEntry.define('VERSION')
export const typeId = KVStoreEntry.define('typeId')
export const magicHash = KVStoreEntry.define('magicHash')
export const address = KVStoreEntry.define('address')
export const signKey = KVStoreEntry.define('signKey')
export const encKeyBuffer = KVStoreEntry.define('encKeyBuffer')
export const encKeyBufferUnpadded = KVStoreEntry.define('encKeyBufferUnpadded')
export const value = KVStoreEntry.define('value')

export const selectVERSION = view(VERSION)
export const selectTypeId = view(typeId)
export const selectMagicHash = view(magicHash)
export const selectAddress = view(address)
export const selectSignKey = view(signKey)
export const selectEncKeyBuffer = view(encKeyBuffer)
export const selectValue = view(value)

export const reviver = (jsObject) => {
  return new KVStoreEntry(jsObject)
}

export const createEmpty = (typeId) => {
  return new KVStoreEntry({ VERSION: 1, typeId })
}

export const fromKeys = (entryECKey, encKeyBuffer, encKeyBufferUnpadded, typeId) => {
  return new KVStoreEntry({
    VERSION: 1,
    typeId: isNil(typeId) ? -1 : typeId,
    magicHash: null,
    address: keyPairToAddress(entryECKey),
    signKey: entryECKey.toWIF(),
    encKeyBuffer,
    encKeyBufferUnpadded,
    value: void 0,
  })
}

export const fromCredentials = curry((guid, sharedKey, password, network) => {
  const entropy = crypto.sha256(Buffer.from(guid + sharedKey + password))
  const key = Bitcoin.ECPair.fromPrivateKey(entropy)
  const enc = key.privateKey
  return fromKeys(key, enc)
})

export const getMasterHDNode = curry((network, seedHex) => {
  const mnemonic = BIP39.entropyToMnemonic(seedHex)
  const masterhex = BIP39.mnemonicToSeed(mnemonic)
  return Bitcoin.bip32.fromSeed(masterhex, network)
})

export const deriveMetadataNode = (masterHDNode) => {
  // BIP 43 purpose needs to be 31 bit or less. For lack of a BIP number
  // we take the first 31 bits of the SHA256 hash of a reverse domain.
  let hash = crypto.sha256('info.blockchain.metadata')
  let purpose = hash.slice(0, 4).readUInt32BE(0) & 0x7fffffff // 510742
  return masterHDNode.deriveHardened(purpose)
}

export const fromMetadataXpriv = curry((xpriv, typeId, network) => {
  return fromMetadataHDNode(Bitcoin.bip32.fromBase58(xpriv, network), typeId)
})

export const fromMetadataHDNode = curry((metadataHDNode, typeId) => {
  let payloadTypeNode = metadataHDNode.deriveHardened(typeId)
  let node = payloadTypeNode.deriveHardened(0)
  let keypair = Bitcoin.ECPair.fromPrivateKey(node.privateKey)
  let privateKey = payloadTypeNode.deriveHardened(1).privateKey
  let encKeyBuffer = crypto.sha256(privateKey)
  let encKeyBufferUnpadded = crypto.sha256(removeZeroPadding(privateKey))
  return fromKeys(keypair, encKeyBuffer, encKeyBufferUnpadded, typeId)
})

export const fromMasterHDNode = curry((masterHDNode, typeId) => {
  let metadataHDNode = deriveMetadataNode(masterHDNode)
  return fromMetadataHDNode(metadataHDNode, typeId)
})

export const fromHdWallet = curry((hdWallet, typeId) => {
  const masterHdNode = getMasterHDNode(hdWallet.seedHex)
  return fromMasterHDNode(masterHdNode, typeId)
})

export const encrypt = curry((key, data) =>
  crypto.encryptDataWithKey(data, key, null, { mode: U.AES.CBC })
)
export const decrypt = curry((key, data) => crypto.decryptDataWithKey(data, key))
export const B64ToBuffer = (base64) => Buffer.from(base64, 'base64')
export const StringToBuffer = (base64) => Buffer.from(base64)

// message :: Buffer -> Buffer -> Base64String
export const message = curry((payload, prevMagic) => {
  if (prevMagic) {
    const hash = crypto.sha256(payload)
    const buff = Buffer.concat([prevMagic, hash])
    return buff.toString('base64')
  } else {
    return payload.toString('base64')
  }
})

// magic :: Buffer -> Buffer -> Buffer
export const magic = curry((payload, prevMagic, network) => {
  let msg = message(payload, prevMagic)
  return BitcoinMessage.magicHash(msg, network.messagePrefix)
})

export const verify = curry((address, signature, hash, network) => {
  return BitcoinMessage.verify(hash, address, signature, network.messagePrefix)
})

// sign :: keyPair -> msg -> Buffer
export const sign = curry((keyPair, msg) =>
  BitcoinMessage.sign(msg, keyPair.privateKey, keyPair.compressed)
)

// computeSignature :: keypair -> buffer -> buffer -> base64
export const computeSignature = curry((keyWIF, payloadBuff, magicHash, network) => {
  const key = Bitcoin.ECPair.fromWIF(keyWIF, network)
  return sign(key, message(payloadBuff, magicHash))
})

export const verifyResponse = curry((address, network, res) => {
  if (res === null) return Either.of(res)
  let sB = res.signature ? Buffer.from(res.signature, 'base64') : undefined
  let pB = res.payload ? Buffer.from(res.payload, 'base64') : undefined
  let mB = res.prev_magic_hash ? Buffer.from(res.prev_magic_hash, 'hex') : undefined
  let verified = verify(address, sB, message(pB, mB), network)
  if (!verified) {
    return Either.Left(new Error('METADATA_SIGNATURE_VERIFICATION_ERROR'))
  }
  return Either.of(assoc('compute_new_magic_hash', magic(pB, mB, network), res))
})

export const extractResponse = curry((encKey, encKeyUnpadded, res) => {
  if (res === null) {
    return res
  } else {
    // TODO: remove when redux/core is moved to frontend
    if (window.logLevel === 'verbose' && res.type_id !== -1) {
      // eslint-disable-next-line no-console
      try {
        console.info(
          'LOG: trying padded enc key',
          compose(JSON.parse, decrypt(encKey), prop('payload'))(res)
        )
      } catch (e) {
        console.error(e)
        console.info(
          'LOG: trying unpadded enc key',
          compose(JSON.parse, decrypt(encKeyUnpadded), prop('payload'))(res)
        )
      }
    }
    try {
      // First try padded encryption key
      return compose(JSON.parse, decrypt(encKey), prop('payload'))(res)
    } catch (e) {
      // If padded key fails try the unpadded key that
      // was used before bitcoinjs-lib update to v5 on ios/web
      return compose(JSON.parse, decrypt(encKeyUnpadded), prop('payload'))(res)
    }
  }
})

// Remove all `00` leading nibbles from Buffer.
// Input [0, 0, 0, 10, 0, 20, 30]
// Output [10, 0, 20, 30]]
export const removeZeroPadding = function (buffer) {
  while (buffer.length > 0 && buffer.readUInt8(0) == 0) {
    buffer = buffer.slice(1)
  }
  return buffer
}
