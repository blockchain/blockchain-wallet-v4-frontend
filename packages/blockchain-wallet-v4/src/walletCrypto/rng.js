import assert from 'assert'
import Either from 'data.either'
import randomBytes from 'randombytes'

import { isHex, isPositiveInteger } from '../utils/checks'

const FORMAT = 'hex'
const DEFAULT_BYTES = 32

// Expose randomBytes for iOS to override
export const _overrides = {
  randomBytes
}

// xor :: Buffer -> Buffer -> Buffer
export const xor = (a, b) => {
  assert(
    Buffer.isBuffer(a) && Buffer.isBuffer(b),
    'Expected arguments to be buffers'
  )

  let length = Math.min(a.length, b.length)
  let buffer = Buffer.alloc(length)

  for (let i = 0; i < length; ++i) {
    buffer[i] = a[i] ^ b[i]
  }

  return buffer
}

// getServerEntropy :: Int -> Promise (Either Buffer Error) Error
export const getServerEntropy = (nBytes = DEFAULT_BYTES, api) => {
  if (!isPositiveInteger(nBytes)) {
    return Promise.resolve(
      Either.Left(
        new Error('Must provide a positive integer to getServerEntropy')
      )
    )
  }

  return api.getRandomBytes(nBytes, FORMAT).then(responseText => {
    try {
      assert(isHex(responseText), 'Non-hex server entropy answer.')

      let B = Buffer.from(responseText, FORMAT)

      assert(B.length === nBytes, 'Different entropy length requested.')

      return Either.of(B)
    } catch (e) {
      return Either.Left(e)
    }
  })
}

// mixEntropy :: Buffer -> Buffer -> Buffer
export const mixEntropy = (localH, serverH, nBytes) => {
  try {
    assert(localH.length > 0, 'Local entropy should not be empty.')

    assert(serverH.length > 0, 'Server entropy should not be empty.')

    assert(
      !Array.prototype.every.call(localH, b => b === localH[0]),
      'The browser entropy should not be the same byte repeated.'
    )

    assert(
      !Array.prototype.every.call(serverH, b => b === serverH[0]),
      'The server entropy should not be the same byte repeated.'
    )

    assert(
      serverH.length === localH.length,
      'Both entropies should be same of the length.'
    )

    let combinedH = xor(localH, serverH)

    assert(
      !Array.prototype.every.call(combinedH, b => b === combinedH[0]),
      'The combined entropy should not be the same byte repeated.'
    )

    assert(
      combinedH.length === nBytes,
      'Combined entropy should be of requested length.'
    )

    return Either.of(combinedH)
  } catch (e) {
    return Either.Left(
      new Error('Failed to generate the entropy: ' + e.message)
    )
  }
}

// createRng :: Int -> Promise Rng Error
const createRng = (maxBytes = DEFAULT_BYTES, api) => {
  return getServerEntropy(maxBytes, api).then(serverH => {
    let localH = _overrides.randomBytes(maxBytes)
    let entropy = serverH.chain(sH => mixEntropy(localH, sH, maxBytes))

    // Rng :: Int -> Buffer
    return nBytes => {
      nBytes = isPositiveInteger(nBytes) ? nBytes : DEFAULT_BYTES

      if (entropy.isLeft) {
        throw entropy.value
      }

      if (entropy.value.length < nBytes) {
        throw new Error('rng ran out of server provided entropy')
      }

      let generated = entropy.value.slice(0, nBytes)
      entropy = entropy.map(e => e.slice(nBytes))
      return generated
    }
  })
}

export default createRng
