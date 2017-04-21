import { Map, List, fromJS as iFromJS } from 'immutable-ext'
import Either from 'data.either'
import * as R from 'ramda'
const { compose, over, view, curry } = R
import { traversed, traverseOf } from 'ramda-lens'
import { iLensProp } from '../lens'
import * as crypto from '../WalletCrypto'
import Address, * as AddressUtil from './Address'
import HDWallet, * as HDWalletUtil from './HDWallet'
import { typeDef, iRename } from '../util'

/* Wallet :: {
  guid :: String
  sharedKey :: String
  double_encryption :: Bool
  metadataHDNode :: String
  options :: Options
  address_book :: [{ [addr]: String }]
  tx_notes :: [{ tx: String, note: String }]
  tx_names :: ???
  addresses :: {Address}
  hd_wallets :: [HDWallet]
} */

function Wallet (x) {
  this.__internal = Map(x)
}

const { guard, define } = typeDef(Wallet)

export const guid = define('guid')
export const sharedKey = define('sharedKey')
export const doubleEncryption = define('double_encryption')
export const options = define('options')
export const pbkdf2Iterations = compose(options, iLensProp('pbkdf2_iterations'))
export const addresses = define('addresses')
export const dpasswordhash = define('dpasswordhash')
export const hdWallets = define('hd_wallets')

export const selectGuid = view(guid)
export const selectIterations = view(pbkdf2Iterations)
export const selectAddresses = compose((as) => as.toList(), view(addresses))
export const selectHdWallets = view(hdWallets)
export const selectHdWallet = compose((xs) => xs.last(), selectHdWallets)
export const isDoubleEncrypted = compose(Boolean, view(doubleEncryption))

export const fromJS = (x) => {
  let addressesMapCons = over(addresses, (as) => Map(as.map(a => [a.get('addr'), new Address(a)])))
  let hdWalletListCons = over(hdWallets, (xs) => List(xs.map(HDWalletUtil.fromJS)))
  let walletCons = compose(hdWalletListCons, addressesMapCons)
  return walletCons(new Wallet(iRename('keys', 'addresses', iFromJS(x))))
}

export const toJS = R.pipe(guard, (wallet) => {
  let selectAddressesJS = compose(R.map(AddressUtil.toJS), selectAddresses)
  let destructAddressses = R.set(addresses, selectAddressesJS(wallet))

  let selectHdWalletsJS = compose(R.map(HDWalletUtil.toJS), selectHdWallets)
  let destructHdWallets = R.set(hdWallets, selectHdWalletsJS(wallet))

  let destructWallet = compose(destructHdWallets, destructAddressses)
  return iRename('addresses', 'keys', destructWallet(wallet).__internal).toJS()
})

// isValidSecondPwd :: String -> Wallet -> Bool
export const isValidSecondPwd = curry((password, wallet) => {
  if (isDoubleEncrypted(wallet)) {
    let iter = selectIterations(wallet)
    let sk = view(sharedKey, wallet)
    let storedHash = view(dpasswordhash, wallet)
    let computedHash = crypto.hashNTimes(iter, R.concat(sk, password)).toString('hex')
    return storedHash === computedHash
  } else {
    return true
  }
})

// addAddress :: Wallet -> Address -> String -> Wallet
export const addAddress = curry((wallet, address, password) => {
  let it = selectIterations(wallet)
  let sk = view(sharedKey, wallet)
  let set = curry((a, as) => as.set(AddressUtil.selectAddr(a), a))
  let append = (w, a) => over(addresses, set(a), w)
  if (!isDoubleEncrypted(wallet)) {
    return append(wallet, address)
  } else if (isValidSecondPwd(password, wallet)) {
    return append(wallet, AddressUtil.encrypt(it, sk, password, address))
  } else {
    throw new Error('INVALID_SECOND_PASSWORD')
  }
})

// cipher :: (String -> String) -> Wallet -> Either error Wallet
export const cipher = curry((f, wallet) => {
  const trAddr = traverseOf(compose(addresses, traversed, AddressUtil.priv), Either.of, f)
  const trSeed = traverseOf(compose(hdWallets, traversed, HDWalletUtil.seedHex), Either.of, f)
  const trXpriv = traverseOf(compose(hdWallets, traversed, HDWalletUtil.accounts, traversed, HDWalletUtil.xpriv), Either.of, f)
  return Either.Right(wallet).chain(trAddr).chain(trSeed).chain(trXpriv)
})

// encrypt :: String -> Wallet -> Either error Wallet
export const encrypt = curry((password, wallet) => {
  if (isDoubleEncrypted(wallet)) {
    return Either.Right(wallet)
  } else {
    let iter = selectIterations(wallet)
    let sk = view(sharedKey, wallet)
    let enc = Either.try(crypto.encryptSecPass(iter, sk, password))
    let hash = crypto.hashNTimes(iter, R.concat(sk, password)).toString('hex')

    let setFlag = over(doubleEncryption, () => true)
    let setHash = over(dpasswordhash, () => hash)

    return cipher(enc, wallet).map(compose(setHash, setFlag))
  }
})

// decrypt :: String -> Wallet -> Either error Wallet
export const decrypt = curry((password, wallet) => {
  if (isDoubleEncrypted(wallet)) {
    let invalidError = new Error('INVALID_SECOND_PASSWORD')
    let decryptError = new Error('DECRYPT_FAILURE')

    if (!isValidSecondPwd(password, wallet)) {
      return Either.Left(invalidError)
    }

    let iter = selectIterations(wallet)
    let sk = view(sharedKey, wallet)

    let tryDec = Either.try(crypto.decryptSecPass(sk, iter, password))
    let checkFailure = (str) => str === '' ? Either.Left(decryptError) : Either.Right(str)
    let dec = (msg) => tryDec(msg).chain(checkFailure)

    let setFlag = over(doubleEncryption, () => false)
    let setHash = over(dpasswordhash, () => null)

    return cipher(dec, wallet).map(compose(setHash, setFlag))
  } else {
    return Either.Right(wallet)
  }
})

export default Wallet
