// Internal resources
import {Map} from 'immutable'
import {assertPubKey, wrapPubKey} from './helper'

let sha = require('sha256')
let ec = require('secp256k1')

function generatePerCommitmentSecret (seed, I) {
  for (let i = 47; i >= 0; i--) {
    let index = Math.floor(i / 8)
    if (I[5 - Math.floor(i / 8)] >> (i % 8) & 1) {
      seed[index] ^= 1 << (i % 8)
      seed = sha(seed, {asBytes: true})
    }
  }
  return seed
}

function generatePerCommitmentPoint (seed, index) {
  let I = intToArray(index)
  let secret = Buffer.from(generatePerCommitmentSecret(seed, I))
  return ec.publicKeyCreate(secret, true)
}

function concat (a, b) {
  let i
  let res = []
  for (i = 0; i < a.length; i++) {
    res.push(a[i])
  }

  for (i = 0; i < b.length; i++) {
    res.push(b[i])
  }
  return res
}

function derivePubKey (basePoint, perCommitmentPoint) {
  let a = concat(perCommitmentPoint, basePoint)

  a = sha(a, {asBytes: true})
  return ec.publicKeyTweakAdd(Buffer.from(basePoint), Buffer.from(a), true)
}

function derivePrivKey (baseSecret, basePoint, perCommitmentPoint) {
  let a = concat(perCommitmentPoint, basePoint)
  a = sha(a, {asBytes: true})
  return ec.privateKeyTweakAdd(Buffer.from(baseSecret), Buffer.from(a), true)
}

function deriveKey (key, perCommitmentPoint) {
  assertPubKey(key.pub)

  if (Buffer.isBuffer(key.priv)) {
    let priv = derivePrivKey(key.priv, key.pub, perCommitmentPoint)
    let pub = ec.publicKeyCreate(priv, true)
    return {priv: priv, pub: pub}
  } else {
    return wrapPubKey(derivePubKey(key.pub, perCommitmentPoint))
  }
}

function deriveRevocationPubKey (basePoint, perCommitmentPoint) {
  let b = concat(basePoint, perCommitmentPoint)
  b = sha(b, {asBytes: true})
  let a = concat(perCommitmentPoint, basePoint)
  a = sha(a, {asBytes: true})
  let bp = ec.publicKeyTweakMul(Buffer.from(basePoint), Buffer.from(b), true)
  let ap = ec.publicKeyTweakMul(Buffer.from(perCommitmentPoint), Buffer.from(a), true)

  return ec.publicKeyCombine([ap, bp], true)
}

function deriveRevocationPrivKey (baseSecret, perCommitmentSecret, basePoint, perCommitmentPoint) {
  let b = concat(basePoint, perCommitmentPoint)
  b = sha(b, {asBytes: true})
  let a = concat(perCommitmentPoint, basePoint)
  a = sha(a, {asBytes: true})
  let bp = ec.privateKeyTweakMul(Buffer.from(baseSecret), Buffer.from(b), true)
  let ap = ec.privateKeyTweakMul(Buffer.from(perCommitmentSecret), Buffer.from(a), true)

  return ec.privateKeyTweakAdd(ap, bp, true)
}

function getStorageIndex (I) {
  I = intToArray(I)
  for (let i = 0; i < 48; i++) {
    if (I[5 - Math.floor(i / 8)] >> (i % 8) & 1) {
      return i
    }
  }
  return 48
}

let intToArray = (i) => {
  let byteArray = [0, 0, 0, 0, 0, 0]

  for (let index = 0; index < byteArray.length; index++) {
    let byte = i & 0xff
    byteArray[ index ] = byte
    i = (i - byte) / 256
  }

  return byteArray.reverse()
}

function isCorrectNewSecret (storedSecrets, secret, I) {
  let index = getStorageIndex(I)
  for (let i = 0; i < index; i++) {
    let storedSecretI = storedSecrets.get(i)

    if (storedSecretI !== undefined) {
      let derivedSecret = Buffer.from(deriveSecret(secret, i, storedSecretI.get('index')))

      if (!derivedSecret.equals(storedSecretI.get('secret'))) {
        return false
      }
    }
  }
  return true
}

function insertSecret (storedSecrets, secret, I) {
  let index = getStorageIndex(I)
  return storedSecrets
    .set(index, Map({index: I, secret}))
}

function deriveSecret (seed, bits, I) {
  I = intToArray(I)
  let result = Buffer.from(seed)
  for (let i = bits; i >= 0; i--) {
    let index = Math.floor(i / 8)
    if (I[5 - Math.floor(i / 8)] >> (i % 8) & 1) {
      result[index] ^= 1 << (i % 8)
      result = sha(result, {asBytes: true})
    }
  }
  return result
}

module.exports = {
  generatePerCommitmentPoint,
  generatePerCommitmentSecret,
  deriveKey,
  derivePubKey,
  derivePrivKey,
  deriveRevocationPubKey,
  deriveRevocationPrivKey,
  isCorrectNewSecret,
  insertSecret
}
