
import { propEq, propSatisfies } from 'ramda'
import crypto from '../WalletCrypto'
import Either from 'data.either'

const parseQRcode = (data) => {
  const split = string => {
    const [version, guid, encrypted] = string.split('|')
    return ({ version, guid, encrypted })
  }

  const checkVersion = object => {
    if (propEq('version', '1', object)) {
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
    crypto.decryptDataWithPasswordSync(data, passphrase, 10)

  const getCredentials = decryptedData => {
    const [sharedKey, passwordHex] = decryptedData.split('|')
    const password = Buffer.from(passwordHex, 'hex').toString('utf8')
    return { sharedKey, password }
  }

  return Either.fromNullable(data).map(decryptData).map(getCredentials)
}

export { parseQRcode, decode }
