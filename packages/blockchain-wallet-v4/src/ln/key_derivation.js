// Internal resources

let sha = require('sha256')
let ec = require('secp256k1')
let Buffer = require('buffer').Buffer

let storedSecrets = [];

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

function getStorageIndex(I) {
  for (let i = 0; i < 48; i++) {
    if (I[5 - Math.floor(i / 8)] >> (i % 8) & 1) {
      return i;
    }
  }
  return 48;
}

function insertSecret(secret, I) {
  let index = getStorageIndex(I)
  for (let i = 0; i < index; i++) {
    if (storedSecrets[i] !== undefined &&
      !Buffer.from(deriveSecret(secret, i, storedSecrets[i].index)).equals(storedSecrets[i].secret)) {
      return false;
    }
  }
  storedSecrets[index] = {}
  storedSecrets[index].index = I;
  storedSecrets[index].secret = secret
  return true
}


function deriveOldSecret(I) {
  for (let i = 0; i < storedSecrets.length; i++) {
    if (I & (~(1 << i - 1)) == storedSecrets[i].index) {
      return deriveSecret(storedSecrets[i].secret, i, I)
    }
  }
}


function deriveSecret (seed, bits, I) {
  var result = new Buffer(seed);
  for (let i = bits; i >= 0; i--) {
    let index = Math.floor(i / 8)
    if (I[5 - Math.floor(i / 8)] >> (i % 8) & 1) {
      result[index] ^= 1 << (i % 8)
      result = sha(result, {asBytes: true})
    }
  }
  return result
}

module.exports = {generatePerCommitmentSecret: generatePerCommitmentSecret,
                  deriveLocalKey: deriveLocalKey,
                  deriveLocalPrivateKey: deriveLocalPrivateKey,
                  deriveRevocationKey: deriveRevocationKey,
                  deriveRevocationPrivateKey: deriveRevocationPrivateKey,
                  insertSecret: insertSecret}

