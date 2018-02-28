import * as crypto from 'crypto'
import { pbkdf2, pbkdf2Sync } from 'pbkdf2'
import assert from 'assert'
import Task from 'data.task'
import * as U from './utils'
import { curry, compose, lensProp, assoc, dissoc, view } from 'ramda'
import { traverseOf } from 'ramda-lens'
import Either from 'data.either'

export const parseDecrypted = (json) => (
  Either.try(JSON.parse)(json).leftMap(() => new Error('WRONG_PASSWORD'))
)

export const sha256 = (data) => crypto.createHash('sha256').update(data).digest()

// decryptWallet :: Password -> payload JSON -> Either Error JSON
export const decryptWallet = curry(
  (password, data) => decryptWrapper(password, data).chain(parseDecrypted))

// decryptWrapper :: Password -> JSON -> Either Error String
const decryptWrapper = curry((password, wrapper) =>
  Either.try(() => decryptDataWithPasswordSync(wrapper.payload, password, wrapper.pbkdf2_iterations))()
)

export const encryptWallet = curry((data, password, pbkdf2Iterations, version) => {
  assert(data, 'data missing')
  assert(password, 'password missing')
  assert(pbkdf2Iterations, 'pbkdf2Iterations missing')
  assert(version, 'version missing')

  return JSON.stringify({
    pbkdf2_iterations: pbkdf2Iterations,
    version: version,
    payload: encryptDataWithPasswordSync(data, password, pbkdf2Iterations)
  })
})

// stretchPassword :: password -> salt -> iterations -> keylen -> Task Error Buffer
function stretchPassword (password, salt, iterations, keyLenBits) {
  assert(salt, 'salt missing')
  assert(password && typeof password === 'string', 'password string required')
  assert(typeof iterations === 'number' && iterations > 0, 'positive iterations number required')
  assert(keyLenBits == null || keyLenBits % 8 === 0, 'key length must be evenly divisible into bytes')

  var saltBuffer = Buffer.from(salt, 'hex')
  var keyLenBytes = (keyLenBits || 256) / 8

  return new Task((reject, resolve) => {
    pbkdf2(password, saltBuffer, iterations, keyLenBytes, 'sha1', (error, key) => {
      if (error) reject(error)
      else resolve(key)
    })
  })
}

// stretchPasswordSync :: password -> salt -> iterations -> keylen -> Buffer
function stretchPasswordSync (password, salt, iterations, keyLenBits) {
  assert(salt, 'salt missing')
  assert(password && typeof password === 'string', 'password string required')
  assert(typeof iterations === 'number' && iterations > 0, 'positive iterations number required')
  assert(keyLenBits == null || keyLenBits % 8 === 0, 'key length must be evenly divisible into bytes')

  var saltBuffer = Buffer.from(salt, 'hex')
  var keyLenBytes = (keyLenBits || 256) / 8
  return pbkdf2Sync(password, saltBuffer, iterations, keyLenBytes, 'sha1')
}

// decryptDataWithPassword :: data -> password -> iterations -> options -> Task Error Buffer
function decryptDataWithPassword (data, password, iterations, options) {
  if (!data) return Task.of(data)
  assert(password, 'password missing')
  assert(iterations, 'iterations missing')
  var dataHex = Buffer.from(data, 'base64')
  var iv = dataHex.slice(0, U.SALT_BYTES)
  var payload = dataHex.slice(U.SALT_BYTES)
  var salt = iv
  return stretchPassword(password, salt, iterations, U.KEY_BIT_LEN).map((key) => {
    return decryptBufferWithKey(payload, iv, key, options)
  })
}

// decryptDataWithPasswordSync :: data -> password -> iterations -> options -> Buffer
export function decryptDataWithPasswordSync (data, password, iterations, options) {
  if (!data) { return data }
  assert(password, 'password missing')
  assert(iterations, 'iterations missing')
  var dataHex = Buffer.from(data, 'base64')
  var iv = dataHex.slice(0, U.SALT_BYTES)
  var payload = dataHex.slice(U.SALT_BYTES)
  //  AES initialization vector is also used as the salt in password stretching
  var salt = iv
  // Expose stretchPassword for iOS to override
  var key = stretchPasswordSync(password, salt, iterations, U.KEY_BIT_LEN)
  return decryptBufferWithKey(payload, iv, key, options)
}

export const stringToKey = (string, iterations) => stretchPasswordSync(string, 'salt', iterations, U.KEY_BIT_LEN)

// payload: (Buffer)
// iv: initialization vector (Buffer)
// key: AES key (256 bit Buffer)
// options: (optional)
// returns: decrypted payload (e.g. a JSON string)
function decryptBufferWithKey (payload, iv, key, options) {
  options = options || {}
  options.padding = options.padding || U.Iso10126

  var decryptedBytes = U.AES.decrypt(payload, key, iv, options)
  return decryptedBytes.toString('utf8')
}

function encryptDataWithPassword (data, password, iterations) {
  if (!data) return Task.of(data)
  assert(password, 'password missing')
  assert(iterations, 'iterations missing')
  var salt = crypto.randomBytes(U.SALT_BYTES)
  return stretchPassword(password, salt, iterations, U.KEY_BIT_LEN).map((key) => {
    return exports.encryptDataWithKey(data, key, salt)
  })
}

export function encryptDataWithPasswordSync (data, password, iterations) {
  if (!data) { return data }
  assert(password, 'password missing')
  assert(iterations, 'iterations missing')

  var salt = crypto.randomBytes(U.SALT_BYTES)
  var key = stretchPasswordSync(password, salt, iterations, U.KEY_BIT_LEN)
  return exports.encryptDataWithKey(data, key, salt)
}

// data: e.g. JSON.stringify({...})
// key: AES key (256 bit Buffer)
// iv: optional initialization vector
// returns: concatenated and Base64 encoded iv + payload
export var encryptDataWithKey = curry((data, key, iv) => {
  let IV = iv || crypto.randomBytes(U.SALT_BYTES)
  let dataBytes = Buffer.from(data, 'utf8')
  let options = { mode: U.AES.CBC, padding: U.Iso10126 }
  let encryptedBytes = U.AES.encrypt(dataBytes, key, IV, options)
  let payload = Buffer.concat([ IV, encryptedBytes ])
  return payload.toString('base64')
})

export const decryptDataWithKey = curry((data, key) => {
  let dataHex = Buffer.from(data, 'base64')
  let iv = dataHex.slice(0, U.SALT_BYTES)
  let payload = dataHex.slice(U.SALT_BYTES)
  return decryptBufferWithKey(payload, iv, key)
})

const checkFailure = curry((pass, fail, str) => str === '' ? fail(new Error('DECRYPT_FAILURE')) : pass(str))

export const encryptSecPass = curry((sharedKey, pbkdf2Iterations, password, message) =>
  encryptDataWithPassword(message, sharedKey + password, pbkdf2Iterations))

export const encryptSecPassSync = curry((sharedKey, pbkdf2Iterations, password, message) =>
  Either.try(() => encryptDataWithPasswordSync(message, sharedKey + password, pbkdf2Iterations))())

export const decryptSecPass = curry((sharedKey, pbkdf2Iterations, password, message) =>
  decryptDataWithPassword(message, sharedKey + password, pbkdf2Iterations)
    .chain(checkFailure(Task.of, Task.rejected)))

export const decryptSecPassSync = curry((sharedKey, pbkdf2Iterations, password, message) =>
  Either.try(() => decryptDataWithPasswordSync(message, sharedKey + password, pbkdf2Iterations))()
    .chain(checkFailure(Either.of, Either.Left)))

export const hashNTimes = curry((iterations, data) => {
  assert(iterations > 0, '`iterations` must be a number greater than 0')
  while (iterations--) data = sha256(data)
  return data
})

export const isStringHashInFraction = (str, fraction) => {
  if (!str) return false
  if (fraction < 0) return false
  return (crypto.sha256(str)[0] / 256) >= (1 - fraction)
}
