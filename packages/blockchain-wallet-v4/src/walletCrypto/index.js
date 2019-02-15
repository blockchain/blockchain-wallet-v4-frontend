import * as crypto from 'crypto'
import { pbkdf2 } from 'pbkdf2'
import assert from 'assert'
import Task from 'data.task'
import BIP39 from 'bip39'
import * as U from './utils'
import Either from 'data.either'
import createRng from './rng'
import { curry, compose, is, isNil, sequence, has, propSatisfies } from 'ramda'

const SUPPORTED_ENCRYPTION_VERSION = 3

// eitherToTask :: Either a b -> Task a b
const eitherToTask = e => e.fold(Task.rejected, Task.of)

// TaskTry :: (a -> b) -> (a -> Task Error b)
const TaskTry = f =>
  compose(
    eitherToTask,
    Either.try(f)
  )

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

// toPayloadAndIV :: Buffer -> Object
const toPayloadAndIV = data => {
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
// returns: concatenated and Base64 encoded iv + payload
export const encryptDataWithKey = curry((data, key, iv) => {
  let IV = iv || crypto.randomBytes(U.SALT_BYTES)
  let dataBytes = Buffer.from(data, 'utf8')
  let options = { mode: U.AES.CBC, padding: U.Iso10126 }
  let encryptedBytes = U.AES.encrypt(dataBytes, key, IV, options)
  let payload = Buffer.concat([IV, encryptedBytes])
  return payload.toString('base64')
})

// data: base64 string
// key: AES key (256 bit Buffer)
// returns; decrypted payload (e.g. a JSON string)
export const decryptDataWithKey = curry((data, key) => {
  let dataHex = Buffer.from(data, 'base64')
  let iv = dataHex.slice(0, U.SALT_BYTES)
  let payload = dataHex.slice(U.SALT_BYTES)
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
    TaskTry(toPayloadAndIV)(data).chain(({ iv, payload }) =>
      stretchPassword(password, iv, iterations, U.KEY_BIT_LEN).chain(key =>
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
    .chain(key => TaskTry(encryptDataWithKey)(data, key, salt))
}

// encryptSecPass :: String -> Integer -> String -> String -> Task, Error String
export const encryptSecPass = curry(
  (sharedKey, pbkdf2Iterations, password, message) =>
    encryptDataWithPassword(message, sharedKey + password, pbkdf2Iterations)
)

const checkFailure = curry((pass, fail, str) =>
  str === '' ? fail(new Error('DECRYPT_FAILURE')) : pass(str)
)

// decryptSecPass :: String -> Integer -> String -> String -> Task, Error String
export const decryptSecPass = curry(
  (sharedKey, pbkdf2Iterations, password, message) =>
    decryptDataWithPassword(
      message,
      sharedKey + password,
      pbkdf2Iterations
    ).chain(checkFailure(Task.of, Task.rejected))
)

// TODO :: review users of that funciton (moved to task)
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

// decryptWalletV1 :: String -> String -> Task Error Object
export const decryptWalletV1 = (password, data) => {
  let decrypt = (i, o) =>
    decryptDataWithPassword(data, password, i, o).chain(
      safeParse,
      'v1: wrong_wallet_password'
    )
  // v1: CBC, ISO10126, 10 iterations
  return (
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
        decryptDataWithPassword(w.payload, password, w.pbkdf2_iterations)
      )
      .chain(p => safeParse(p, 'v2v3: wrong_wallet_password'))
  )
}

export const decryptWallet = curry((password, data) =>
  decryptWalletV1(password, data).orElse(() =>
    decryptWalletV2V3(password, data)
  )
)
