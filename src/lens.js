import { lens, compose, identity, reduceRight } from 'ramda'

export const iLensProp = (key) => lens(
  (x) => x.get(key),
  (val, x) => x.set(key, val)
)

export const iLensPath = reduceRight(
  (key, lens) => compose(iLensProp(key), lens),
  identity
)

export const addresses = iLensProp('addresses')
export const options = iLensProp('options')
export const hdwallets = iLensProp('hd_wallets')
export const accounts = iLensProp('accounts')
export const cache = iLensProp('cache')
export const receiveAccount = iLensProp('receiveAccount')
export const changeAccount = iLensProp('changeAccount')
export const addressBook = iLensProp('address_book')
export const addressLabels = iLensProp('address_labels')
export const priv = iLensProp('priv')
export const pbkdf2Iterations = iLensProp('pbkdf2_iterations')
export const guid = iLensProp('guid')
export const sharedKey = iLensProp('sharedKey')
export const doubleEncryption = iLensProp('double_encryption')
export const seedHex = iLensProp('seed_hex')
export const xpriv = iLensProp('xpriv')
export const xpub = iLensProp('xpub')
export const dpasswordhash = iLensProp('dpasswordhash')
export const addr = iLensProp('addr')
export const label = iLensProp('label')
export const password = iLensProp('password')
export const payloadChecksum = iLensProp('payload_checksum')
export const language = iLensProp('language')
export const walletImmutable = iLensProp('walletImmutable')
export const first = iLensProp('0')
