// Internal resources

let sha = require('sha256')
let ec = require('secp256k1')
let Buffer = require('buffer').Buffer

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

function deriveKeys (baseSecret, perCommitmentSecret, basePoint, perCommitmentPoint) {
  let keys = {}
  let a = concat(perCommitmentPoint, basePoint)

  a = sha(a, {asBytes: true})
  keys.localKey = ec.publicKeyTweakAdd(Buffer.from(basePoint), Buffer.from(a), true)
  keys.localPrivateKey = ec.privateKeyTweakAdd(Buffer.from(baseSecret), Buffer.from(a), true)

  let b = concat(basePoint, perCommitmentPoint)
  b = sha(b, {asBytes: true})
  let bp = ec.publicKeyTweakMul(Buffer.from(basePoint), Buffer.from(b), true)
  let ap = ec.publicKeyTweakMul(Buffer.from(perCommitmentPoint), Buffer.from(a), true)

  keys.revocationKey = ec.publicKeyCombine([ap, bp], true)

  bp = ec.privateKeyTweakMul(Buffer.from(baseSecret), Buffer.from(b), true)
  ap = ec.privateKeyTweakMul(Buffer.from(perCommitmentSecret), Buffer.from(a), true)

  keys.revocationPrivateKey = ec.privateKeyTweakAdd(ap, bp, true)
  return keys
}

module.exports = {generatePerCommitmentSecret: generatePerCommitmentSecret, deriveKeys: deriveKeys}
