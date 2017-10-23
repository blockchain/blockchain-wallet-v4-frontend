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

function deriveLocalKey (basePoint, perCommitmentPoint) {
  let a = concat(perCommitmentPoint, basePoint)

  a = sha(a, {asBytes: true})
  return ec.publicKeyTweakAdd(Buffer.from(basePoint), Buffer.from(a), true)
}

function deriveLocalPrivateKey (baseSecret, basePoint, perCommitmentPoint) {
  let a = concat(perCommitmentPoint, basePoint)
  a = sha(a, {asBytes: true})
  return ec.privateKeyTweakAdd(Buffer.from(baseSecret), Buffer.from(a), true)
}

function deriveRevocationKey (basePoint, perCommitmentPoint) {
  let b = concat(basePoint, perCommitmentPoint)
  b = sha(b, {asBytes: true})
  let a = concat(perCommitmentPoint, basePoint)
  a = sha(a, {asBytes: true})
  let bp = ec.publicKeyTweakMul(Buffer.from(basePoint), Buffer.from(b), true)
  let ap = ec.publicKeyTweakMul(Buffer.from(perCommitmentPoint), Buffer.from(a), true)

  return ec.publicKeyCombine([ap, bp], true)
}

function deriveRevocationPrivateKey (baseSecret, perCommitmentSecret, basePoint, perCommitmentPoint) {
  let b = concat(basePoint, perCommitmentPoint)
  b = sha(b, {asBytes: true})
  let a = concat(perCommitmentPoint, basePoint)
  a = sha(a, {asBytes: true})
  let bp = ec.privateKeyTweakMul(Buffer.from(baseSecret), Buffer.from(b), true)
  let ap = ec.privateKeyTweakMul(Buffer.from(perCommitmentSecret), Buffer.from(a), true)

  return ec.privateKeyTweakAdd(ap, bp, true)
}

module.exports = {generatePerCommitmentSecret: generatePerCommitmentSecret,
                  deriveLocalKey: deriveLocalKey,
                  deriveLocalPrivateKey: deriveLocalPrivateKey,
                  deriveRevocationKey: deriveRevocationKey,
                  deriveRevocationPrivateKey: deriveRevocationPrivateKey}

