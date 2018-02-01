import * as random from 'crypto'

const assert = require('assert')
const secp = require('bcoin/lib/crypto/secp256k1')
const Long = require('long')
const randomGen = require('random-seed')

const ec = require('secp256k1')

export let assertKey = key => {
  if (key.priv) {
    let pub = secp.publicKeyCreate(key.priv, true)
    assert(key.pub.equals(pub))
  } else {
    assertPubKey(key.pub)
  }
}

export let assertPubKey = pubKey => {
  assert.equal(pubKey.length, 33)
}

export let assertSignature = sig => {
  assert.equal(sig.length, 64)
}

export let assertNumber = num => {
  assert.equal(typeof num, 'number')
}

export let assertLong = num => {
  assert(Long.isLong(num))
}

export let assertBuffer = buf => {
  assert(Buffer.isBuffer(buf))
}

export let addSighash = sig => Buffer.concat([sig, wrapHex('01')])
export let wrapHex = hex => Buffer.from(hex, 'hex')
export let wrapPubKey = (pub) => ({pub, priv: null})

export let toDER = sig => secp.toDER(sig)
export let fromDER = sig => secp.fromDER(sig)
export let sigToBitcoin = sig => addSighash(toDER(sig))

export let identity = a => a

export let copy = obj => Object.assign({}, obj)

export function makeActionCreator (type, ...argNames) {
  return function (...args) {
    let action = { type }
    argNames.forEach((arg, index) => {
      action[argNames[index]] = args[index]
    })
    return action
  }
}

let RANDOM_SEED
let SEED = '8q42FvHJH6e#'
let RANDOM

export let setStaticSeed = () => {
  RANDOM_SEED = 0
  RANDOM = randomGen.create(SEED)
}
export let getRandomBytes = (count) => {
  if (RANDOM) {
    let str = RANDOM.string(count)
    let t = Buffer.from(str)
    return t
  } else {
    if (RANDOM_SEED === 0) {
      RANDOM = randomGen.create(SEED)
    } else {
      RANDOM = randomGen.create(random.randomBytes(32))
    }
    return getRandomBytes(count)
  }
}

export let createKey = () => {
  let key = {}
  key.priv = Buffer.from(getRandomBytes(32))
  key.pub = ec.publicKeyCreate(key.priv, true)
  return key
}
