
import { propEq, propSatisfies } from 'ramda'
import * as crypto from '../WalletCrypto'
import Either from 'data.either'

const PAIRING_CODE_PBKDF2_ITERATIONS = 10
const VERSION = '1'

const parseQRcode = (data) => {
  const split = string => {
    const [version, guid, encrypted] = string.split('|')
    return ({ version, guid, encrypted })
  }
  const checkVersion = object => {
    if (propEq('version', VERSION, object)) {
      return Either.Right(object)
    } else {
      return Either.Left(`Invalid Pairing Version Code ${object.version}`)
    }
  }
  const checkGUID = object => {
    if (propSatisfies(g => (g == null || g.length !== 36), 'guid', object)) {
      return Either.Left(`Invalid Pairing QR Code, GUID is invalid`)
    } else {
      return Either.Right(object)
    }
  }
  return Either.fromNullable(data)
    .map(split)
    .chain(checkVersion)
    .chain(checkGUID)
}

const decode = (data, passphrase) => {
  const decryptData = data =>
    crypto.decryptDataWithPasswordSync(data, passphrase, PAIRING_CODE_PBKDF2_ITERATIONS)

  const getCredentials = decryptedData => {
    const [sharedKey, passwordHex] = decryptedData.split('|')
    const password = Buffer.from(passwordHex, 'hex').toString('utf8')
    return { sharedKey, password }
  }
  return Either.fromNullable(data).map(decryptData).map(getCredentials)
}

const encode = (guid, sharedKey, password, pairingPassword) => {
  const passwordHex = Buffer.from(password, 'utf8').toString('hex')
  const data = `${sharedKey}|${passwordHex}`
  var encrypted = crypto.encryptDataWithPasswordSync(data, pairingPassword, PAIRING_CODE_PBKDF2_ITERATIONS)
  return `${VERSION}|${guid}|${encrypted}`
}

export { parseQRcode, decode, encode }
