import * as crypto from 'crypto'
import { pbkdf2Sync } from 'pbkdf2'
import assert from 'assert'
import * as U from './utils'
import { curry, compose, lensProp, assoc, dissoc, view } from 'ramda'
import { traverseOf } from 'ramda-lens'
import Either from 'data.either'
import { WalletUtils } from '../immutable'
import * as Lens from '../lens'

export const parseDecrypted = (json) => (
  Either.try(JSON.parse)(json).leftMap(() => new Error('WRONG_PASSWORD'))
)

export const sha256 = (data) => crypto.createHash('sha256').update(data).digest()

// decryptWallet :: Password -> payload JSON -> Either Error JSON
export const decryptWallet = curry(
  (password, data) => decryptWrapper(password, data).chain(parseDecrypted))

// decruptWrapper :: Password -> JSON -> Either Error String
const decryptWrapper = curry(
  function (password, wrapper) {
    try {
      return Either.Right(decryptDataWithPassword(wrapper.payload, password, wrapper.pbkdf2_iterations))
    } catch (e) {
      return Either.Left(e)
    }
  }
)

// decryptPayload :: String -> ServerPayload -> Either error DecryptedPayload
export const decryptPayload = password => payload => {
  const plens = lensProp('payload')
  const ilens = lensProp('pbkdf2_iterations')
  const vlens = lensProp('version')
  const iter = view(compose(plens, ilens), payload)
  const ver = view(compose(plens, vlens), payload)
  return traverseOf(plens, Either.of, decryptWallet(password), payload)
         .map(o => assoc('version', ver, o))
         .map(o => assoc('pbkdf2_iterations', iter, o))
         .map(o => assoc('walletImmutable', o.payload, o))
         .map(o => dissoc('payload', o))
         .map(o => assoc('password', password, o))
}

// encryptState :: State -> JSON
export const encryptState = state => {
  const json = WalletUtils.toJS(state.get('walletImmutable'))
  const serialized = JSON.stringify(json)
  const iterations = view(Lens.pbkdf2Iterations, state)
  const password = view(Lens.password, state)
  const encrypted = encryptWallet(serialized, password, iterations, 3.0)
  return ({
    guid: json.guid,
    sharedKey: json.sharedKey,
    length: encrypted.length,
    payload: encrypted,
    checksum: sha256(encrypted).toString('hex'),
    old_checksum: view(Lens.payloadChecksum, state),
    language: view(Lens.language, state)
  })
}

export const encryptWallet = curry((data, password, pbkdf2Iterations, version) => {
  assert(data, 'data missing')
  assert(password, 'password missing')
  assert(pbkdf2Iterations, 'pbkdf2Iterations missing')
  assert(version, 'version missing')

  return JSON.stringify({
    pbkdf2_iterations: pbkdf2Iterations,
    version: version,
    payload: encryptDataWithPassword(data, password, pbkdf2Iterations)
  })
})

// stretchPassword :: password -> salt -> iterations -> keylen -> Buffer
function stretchPassword (password, salt, iterations, keyLenBits) {
  assert(salt, 'salt missing')
  assert(password && typeof password === 'string', 'password string required')
  assert(typeof iterations === 'number' && iterations > 0, 'positive iterations number required')
  assert(keyLenBits == null || keyLenBits % 8 === 0, 'key length must be evenly divisible into bytes')

  var saltBuffer = new Buffer(salt, 'hex')
  var keyLenBytes = (keyLenBits || 256) / 8
  return pbkdf2Sync(password, saltBuffer, iterations, keyLenBytes, 'sha1')
}

// decryptDataWithPassword :: data -> password -> iterations -> options -> Buffer
function decryptDataWithPassword (data, password, iterations, options) {
  if (!data) { return data }
  assert(password, 'password missing')
  assert(iterations, 'iterations missing')

  var dataHex = new Buffer(data, 'base64')
  var iv = dataHex.slice(0, U.SALT_BYTES)
  var payload = dataHex.slice(U.SALT_BYTES)
  //  AES initialization vector is also used as the salt in password stretching
  var salt = iv
  // Expose stretchPassword for iOS to override
  var key = stretchPassword(password, salt, iterations, U.KEY_BIT_LEN)
  var res = decryptBufferWithKey(payload, iv, key, options)
  return res
}

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
  if (!data) { return data }
  assert(password, 'password missing')
  assert(iterations, 'iterations missing')

  var salt = crypto.randomBytes(U.SALT_BYTES)
  // Expose stretchPassword for iOS to override
  var key = stretchPassword(password, salt, iterations, U.KEY_BIT_LEN)

  return encryptDataWithKey(data, key, salt)
}

// data: e.g. JSON.stringify({...})
// key: AES key (256 bit Buffer)
// iv: optional initialization vector
// returns: concatenated and Base64 encoded iv + payload
function encryptDataWithKey (data, key, iv) {
  iv = iv || crypto.randomBytes(U.SALT_BYTES)
  var dataBytes = new Buffer(data, 'utf8')
  var options = { mode: U.AES.CBC, padding: U.Iso10126 }
  var encryptedBytes = U.AES.encrypt(dataBytes, key, iv, options)
  var payload = Buffer.concat([ iv, encryptedBytes ])
  return payload.toString('base64')
}

export const encryptSecPass = curry((sharedKey, pbkdf2Iterations, password, message) =>
  encryptDataWithPassword(message, sharedKey + password, pbkdf2Iterations))

export const decryptSecPass = curry((sharedKey, pbkdf2Iterations, password, message) =>
  decryptDataWithPassword(message, sharedKey + password, pbkdf2Iterations))

export const hashNTimes = curry((iterations, data) => {
  assert(iterations > 0, '`iterations` must be a number greater than 0')
  while (iterations--) data = sha256(data)
  return data
})
