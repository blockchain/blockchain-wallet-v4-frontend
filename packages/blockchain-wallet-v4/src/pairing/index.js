
import { propEq, propSatisfies, isNil, not, compose } from 'ramda'
import * as crypto from '../walletCrypto'
import Task from 'data.task'

const isNotNil = compose(not, isNil)

const TaskFromPredicate = (predicate, value, errorMsg) =>
  predicate(value) ? Task.of(value) : Task.rejected(errorMsg)

const PBKDF2_ITERATIONS = 10
const VERSION = '1'

const parseQRcode = (data) => {
  const split = string => {
    const [version, guid, encrypted] = string.split('|')
    return ({ version, guid, encrypted })
  }

  const isValidGUID = propSatisfies(g => (g != null && g.length === 36), 'guid')
  const isValidVersion = propEq('version', VERSION)
  const errorGUID = `Invalid Pairing QR Code, GUID is invalid`
  const errorVersion = `Invalid Pairing QR Code, Version is invalid`

  return TaskFromPredicate(isNotNil, data, 'Null QR code data to parse')
    .map(split)
    .chain(obj => TaskFromPredicate(isValidGUID, obj, errorVersion))
    .chain(obj => TaskFromPredicate(isValidVersion, obj, errorGUID))
}

// decode :: data -> String -> Task Error Object
const decode = (data, passphrase) => {
  const decryptData = data =>
    crypto.decryptDataWithPassword(data, passphrase, PBKDF2_ITERATIONS)

  const getCredentials = decryptedData => {
    const [sharedKey, passwordHex] = decryptedData.split('|')
    const password = Buffer.from(passwordHex, 'hex').toString('utf8')
    return { sharedKey, password }
  }
  return TaskFromPredicate(isNotNil, data, 'Null QR code data to decode')
    .chain(decryptData).map(getCredentials)
}

// encode :: String -> String -> String -> String -> Task Error String
const encode = (guid, sharedKey, password, pairingPassword) => {
  const passwordHex = Buffer.from(password, 'utf8').toString('hex')
  const data = `${sharedKey}|${passwordHex}`
  return crypto.encryptDataWithPassword(data, pairingPassword, PBKDF2_ITERATIONS)
    .map(encrypted => `${VERSION}|${guid}|${encrypted}`)
}

export { parseQRcode, decode, encode }
