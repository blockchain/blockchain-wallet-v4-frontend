import assert from 'assert'
import BigInteger from 'bigi'
import BIP39 from 'bip39'
import * as Bitcoin from 'bitcoinjs-lib'
import * as crypto from 'crypto'
import Either from 'data.either'
import Task from 'data.task'
import * as curve from 'ecurve'
import hkdf from 'futoin-hkdf'
import { pbkdf2 } from 'pbkdf2'
// @ts-ignore
import { compose, curry, has, is, isNil, propSatisfies, sequence } from 'ramda'

import createRng from './rng'
import * as U from './utils'

export const SUPPORTED_ENCRYPTION_VERSION = 4

// eitherToTask :: Either a b -> Task a b
const eitherToTask = e => e.fold(Task.rejected, Task.of)

// TaskTry :: (a -> b) -> (a -> Task Error b)
const TaskTry = f => compose(eitherToTask, Either.try(f))

// satisfy :: [Bool, String] => Task Error Bool
const satisfy = ([bool, message]) =>
  bool ? Task.of(true) : Task.rejected(message)

// satisfyAll :: [[Bool, String]] => Task Error Bool
const satisfyAll = conditions => sequence(Task.of, conditions.map(satisfy))

// safeParse :: String -> String -> Task error JSON
export const safeParse = (payload, errorMessage) => {
  try {
    return Task.of(JSON.parse(payload))
  } catch (e) {
    return Task.rejected(errorMessage || e)
  }
}

// toPayloadIV :: Buffer -> Object
const toPayloadIV = data => {
  let dataHex = Buffer.from(data, 'base64')

  let iv = dataHex.slice(0, U.SALT_BYTES)
  let payload = dataHex.slice(U.SALT_BYTES)
  return { payload, iv }
}

// pbkdf2Task :: String -> String -> Integer -> Integer -> Task Error Buffer
const pbkdf2Task = (password, salt, iterations, keyLenBits) => {
  try {
    const saltBuffer = Buffer.from(salt, 'hex')
    const keyLenBytes = (keyLenBits || 256) / 8
    return new Task((reject, resolve) => {
      let handle = (error, key) => {
        if (error) reject(error)
        else resolve(key)
      }
      pbkdf2(password, saltBuffer, iterations, keyLenBytes, 'sha1', handle)
    })
  } catch (e) {
    return Task.rejected(e)
  }
}

// payload: (Buffer)
// iv: initialization vector (Buffer)
// key: AES key (256 bit Buffer)
// tag: AES.CBC authTag
// options: (optional)
// returns: decrypted payload (e.g. a JSON string)
const decryptBufferWithKey = (payload, iv, key, options) => {
  options = options || {}
  options.padding = options.padding || U.Iso10126
  let decryptedBytes = U.AES.decrypt(payload, key, iv, options)
  return decryptedBytes.toString('utf8')
}

// hashNTimes :: Integer -> String -> String
export const hashNTimes = curry((iterations, data) => {
  assert(iterations > 0, '`iterations` must be a number greater than 0')
  let result = data
  for (let i = 1; i <= iterations; i++) {
    result = sha256(result)
  }
  return result
})

// isStringHashInFraction :: String -> Float -> Bool
export const isStringHashInFraction = (str, fraction) => {
  if (!str) return false
  if (fraction < 0) return false
  return sha256(str)[0] / 256 >= 1 - fraction
}

// /////////////////////////////////////////////////////////////////////////////

// data: e.g. JSON.stringify({...})
// key: AES key (256 bit Buffer)
// iv: optional initialization vector
// opts: optional mode
// returns: concatenated and Base64 encoded iv + payload
export const encryptDataWithKey = curry((data, key, iv, options) => {
  options = options || {}
  options.padding = U.Iso10126
  let IV = iv || crypto.randomBytes(U.SALT_BYTES)
  let dataBytes = Buffer.from(data, 'utf8')
  let { encryptedBytes, tag } = U.AES.encrypt(dataBytes, key, IV, options)
  let payload = tag
    ? Buffer.concat([tag, IV, encryptedBytes])
    : Buffer.concat([IV, encryptedBytes])
  return payload.toString('base64')
})

// data: base64 string
// key: AES key (256 bit Buffer)
// returns; decrypted payload (e.g. a JSON string)
export const decryptDataWithKey = curry((data, key) => {
  let dataHex = Buffer.from(data, 'base64')
  let iv = dataHex.slice(0, U.SALT_BYTES)
  let payload = dataHex.slice(U.SALT_BYTES)
  // @ts-ignore
  return decryptBufferWithKey(payload, iv, key)
})

// sha256 :: Buffer -> Buffer
export const sha256 = data =>
  crypto
    .createHash('sha256')
    .update(data)
    .digest()

// generateMnemonic :: Api -> Promise String
export const generateMnemonic = api => {
  return createRng(16, api).then(rng => BIP39.generateMnemonic(null, rng))
}

// stretchPassword :: password -> salt -> iterations -> keylen -> Task Error Buffer
export const stretchPassword = (password, salt, iterations, keyLenBits) => {
  return satisfyAll([
    [is(String, password), 'password_required'],
    [is(Number, iterations) && iterations > 0, 'iterations_required'],
    [salt, 'salt_required'],
    [
      isNil(keyLenBits) || keyLenBits % 8 === 0,
      'key_len_multiple_of_8_required'
    ]
  ]).chain(() => pbkdf2Task(password, salt, iterations, keyLenBits))
}

// decryptDataWithPassword :: data -> password -> iterations -> options -> Task Error Buffer
export const decryptDataWithPassword = (
  data,
  password,
  iterations,
  options
) => {
  if (!data) return Task.of(data)
  return satisfyAll([
    [is(String, password), 'password_required'],
    [is(Number, iterations) && iterations > 0, 'iterations_required']
  ]).chain(() =>
    // @ts-ignore
    TaskTry(toPayloadIV)(data, options).chain(({ iv, payload }) =>
      stretchPassword(password, iv, iterations, U.KEY_BIT_LEN).chain(key =>
        // @ts-ignore
        TaskTry(decryptBufferWithKey)(payload, iv, key, options)
      )
    )
  )
}

// encryptDataWithPassword :: String -> String -> Integer -> Task, Error String
export const encryptDataWithPassword = (data, password, iterations) => {
  if (!data) return Task.of(data)
  let salt = crypto.randomBytes(U.SALT_BYTES)
  return satisfyAll([
    [is(String, password), 'password_required'],
    [is(Number, iterations) && iterations > 0, 'iterations_required']
  ])
    .chain(() => stretchPassword(password, salt, iterations, U.KEY_BIT_LEN))
    .chain(key =>
      // @ts-ignore
      TaskTry(encryptDataWithKey)(data, key, salt, { mode: U.AES.CBC })
    )
}

// encryptWallet :: String -> String -> Integer -> String -> Task Error String
export const encryptWallet = curry((data, password, iterations, version) =>
  satisfyAll([
    [data, 'data_required'],
    [is(String, password), 'password_required'],
    [is(Number, iterations) && iterations > 0, 'iterations_required'],
    [version, 'version_required']
  ])
    .chain(() => encryptDataWithPassword(data, password, iterations))
    .map(payload =>
      JSON.stringify({ pbkdf2_iterations: iterations, version, payload })
    )
)

// encryptSecPass :: String -> Integer -> String -> String -> Task, Error String
export const encryptSecPass = curry(
  (sharedKey, pbkdf2Iterations, password, message) =>
    encryptDataWithPassword(message, sharedKey + password, pbkdf2Iterations)
)

const checkFailure = curry((pass, fail, str) =>
  str === '' ? fail(new Error('DECRYPT_FAILURE')) : pass(str)
)

export const decryptSecPass = curry(
  (sharedKey, pbkdf2Iterations, password, message) =>
    // @ts-ignore
    decryptDataWithPassword(
      message,
      sharedKey + password,
      pbkdf2Iterations
    ).chain(checkFailure(Task.of, Task.rejected))
)

// decryptWalletV1 :: String -> String -> Task Error Object
export const decryptWalletV1 = (password, data) => {
  let decrypt = (i, o) =>
    decryptDataWithPassword(data, password, i, o).chain(p =>
      safeParse(p, 'v1: wrong_wallet_password')
    )
  // v1: CBC, ISO10126, 10 iterations
  return (
    // @ts-ignore
    decrypt(10)
      // v1: OFB, nopad, 1 iteration
      .orElse(decrypt.bind(null, 1, { mode: U.AES.OFB, padding: U.NoPadding }))
      // v1: OFB, ISO7816, 1 iteration
      // ISO/IEC 9797-1 Padding method 2 is the same as ISO/IEC 7816-4:2005
      .orElse(decrypt.bind(null, 1, { mode: U.AES.OFB, padding: U.Iso97971 }))
      // v1: CBC, ISO10126, 1 iteration
      .orElse(decrypt.bind(null, 1, { mode: U.AES.CBC, padding: U.Iso10126 }))
  )
}

const validateWrapper = (
  wrapper // wrapper
) =>
  satisfyAll([
    [has('payload', wrapper), 'v2v3 wrapper: payload_required'],
    [has('version', wrapper), 'v2v3 wrapper: version_required'],
    [
      has('pbkdf2_iterations', wrapper),
      'v2v3 wrapper: pbkdf2_iterations_required'
    ],
    [
      // @ts-ignore
      propSatisfies(v => v <= SUPPORTED_ENCRYPTION_VERSION, 'version', wrapper),
      'Wallet version ' + wrapper.version + ' not supported.'
    ]
  ]).map(() => wrapper)

// decryptWalletV2V3 :: String -> String -> Task Error Object
export const decryptWalletV2V3 = (password, data) => {
  return (
    safeParse(data, 'v2v3: wrong_wrapper')
      .chain(validateWrapper)
      // v2/v3: CBC, ISO10126, iterations in wrapper
      .chain(w =>
        decryptDataWithPassword(w.payload, password, w.pbkdf2_iterations, {
          mode: U.AES.CBC
        })
      )
      .chain(p => safeParse(p, 'v2v3: wrong_wallet_password'))
  )
}

export const decryptWallet = curry((password, data) =>
  decryptWalletV1(password, data).orElse(result => {
    return result === 'v1: wrong_wallet_password'
      ? Task.rejected(result)
      : decryptWalletV2V3(password, data)
  })
)

export const derivePubFromPriv = priv => {
  return Bitcoin.ECPair.fromPrivateKey(priv).publicKey
}

export const deriveSharedSecret = (priv, pub) => {
  let c = curve.getCurveByName('secp256k1')
  const privNumber = BigInteger.fromBuffer(priv)

  const p = curve.Point.decodeFrom(c, pub)
  const m = p.multiply(privNumber)

  const encoded = m.getEncoded(true)
  const hashed = sha256(encoded)

  return hkdf(hashed, 32, { hash: 'SHA-256' })
}

export const encryptAESGCM = (key, msg) => {
  let IV = crypto.randomBytes(12)
  let options = { mode: U.AES.GCM }
  let encryptedBytes = U.AES.encrypt(msg, key, IV, options)
  return Buffer.concat([IV, encryptedBytes])
}

export const decryptAESGCM = (key, msg) => {
  let IV = msg.slice(0, 12)
  let dataBytes = msg.slice(12)
  let options = { mode: U.AES.GCM }
  return U.AES.decrypt(dataBytes, key, IV, options)
}
