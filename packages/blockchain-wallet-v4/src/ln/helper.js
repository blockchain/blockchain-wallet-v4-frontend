const assert = require('assert')
const secp = require('bcoin/lib/bcoin-browser').secp256k1
const Long = require('long')

export let assertPubKey = (pubKey) => {
  assert.equal(pubKey.length, 33)
}

export let assertSignature = (sig) => {
  assert.equal(sig.length, 64)
}

export let assertNumber = (num) => {
  assert.equal(typeof num, 'number')
}

export let assertLong = (num) => {
  assert(Long.isLong(num))
}

export let addSighash = (sig) => Buffer.concat([sig, wrapHex('01')])
export let wrapHex = (hex) => Buffer.from(hex, 'hex')

export let toDER = sig => secp.toDER(sig)
export let fromDER = (sig) => secp.fromDER(sig)
export let sigToBitcoin = sig => addSighash(toDER(sig))
