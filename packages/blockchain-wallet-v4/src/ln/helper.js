const assert = require('assert')
const secp = require('bcoin/lib/bcoin-browser').secp256k1

export let testPubKey = (pubKey) => {
  assert.equal(pubKey.length, 33)
}

export let testSignature = (sig) => {
  assert.equal(sig.length, 64)
}

export let testNumber = (num) => {
  assert.equal(typeof num, 'number')
}

export let addSighash = (sig) => Buffer.concat([sig, wrapHex('01')])
export let wrapHex = (hex) => Buffer.from(hex, 'hex')

export let toDER = sig => secp.toDER(sig)
export let fromDER = (sig) => secp.fromDER(sig)
export let sigToBitcoin = sig => addSighash(toDER(sig))
