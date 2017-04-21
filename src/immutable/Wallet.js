import { Map, fromJS as iFromJS } from 'immutable'
// import Either from 'data.either'
import * as R from 'ramda'
const { compose, over, view, curry } = R
// import { traversed, traverseOf } from 'ramda-lens'
import * as Lens from '../lens'
import * as crypto from '../WalletCrypto'
import * as AddressUtil from './Address'
import { error, typeGuard, iRename, iToJS } from '../util'

/* Wallet :: {
  guid :: String
  sharedKey :: String
  double_encryption :: Bool
  metadataHDNode :: String
  options :: Options
  address_book :: [{ [addr]: String }]
  tx_notes :: [{ tx: String, note: String }]
  tx_names :: ???
  addresses :: [Address]
  hd_wallets :: [HDWallet]
} */

function Wallet (x) {
  this.__internal = Map(x)
}

export const fromJS = (x) => {
  return new Wallet(iRename('keys', 'addresses', iFromJS(x)))
}

export const toJS = (wallet) => {
  if (R.is(Wallet, wallet)) {
    return iRename('addresses', 'keys', wallet.__internal).toJS()
  } else {
    error(new TypeError('Expected Wallet'))
  }
}

export const select = typeGuard(Wallet,
  (lens, wallet) => view(lens, wallet.__internal))

export const map = typeGuard(Wallet,
  (f, wallet) => new Wallet(f(wallet.__internal)))

export const guid = Lens.iLensProp('guid')
export const addresses = Lens.iLensProp('addresses')

export const selectGuid = select(guid)
export const selectIterations = select(compose(Lens.options, Lens.pbkdf2Iterations))
export const selectAddresses = compose(iToJS, select(addresses))
export const isDoubleEncrypted = compose(Boolean, select(Lens.doubleEncryption))

// isValidSecondPwd :: String -> Wallet -> Bool
export const isValidSecondPwd = curry((password, wallet) => {
  if (isDoubleEncrypted(wallet)) {
    const iterations = selectIterations(wallet)
    const sharedKey = select(Lens.sharedKey, wallet)
    const storedHash = select(Lens.dpasswordhash, wallet)
    const computedHash = crypto.hashNTimes(iterations, R.concat(sharedKey, password)).toString('hex')
    return storedHash === computedHash
  } else {
    return true
  }
})

// addAddress :: Wallet -> Address -> String -> Wallet
export const addAddress = curry((wallet, address, password) => {
  let it = selectIterations(wallet)
  let sk = select(Lens.sharedKey, wallet)
  let append = (w, a) => map(over(Lens.addresses, R.flip(R.concat)(a)), w)
  if (!isDoubleEncrypted(wallet)) {
    return append(wallet, address)
  } else if (isValidSecondPwd(password, wallet)) {
    return append(wallet, AddressUtil.encrypt(it, sk, password, address))
  } else {
    throw new Error('INVALID_SECOND_PASSWORD')
  }
})

// /////////////////////////////////////////////////////////////////////////////
// second password support
// /////////////////////////////////////////////////////////////////////////////

// check that example to understand traverse:
// https://github.com/ramda/ramda-lens/commit/adb3ef830ef65d3b252e8c9b86b9659e9698cdba#diff-c1129c8b045390789fa8ff62f2c6b4a9R88
// cipher :: (str => str) -> Wallet -> Either error Wallet
// export const cipher = curry((f, wallet) => {
//   const trAddr = traverseOf(compose(R.lensProp('addresses'), traversed, R.lensProp('priv')), Either.of, f)
//   // const traSeed = traverseOf(compose(Lens.hdwallets, traversed, Lens.seedHex), Either.of, f)
//   // const traXpriv = traverseOf(compose(Lens.hdwallets, traversed, Lens.accounts, traversed, Lens.xpriv), Either.of, f)
//   return Either.Right(wallet.__internal.toJS()).chain(trAddr).map(x => new Wallet(x))
//   // return Either.Right(wallet).chain(trAddr).chain(traSeed).chain(traXpriv)
// })

// encrypt :: String -> Wallet -> Either error Wallet
// export const encrypt = curry((password, wallet) => {
//   if (isDoubleEncrypted(wallet)) {
//     return Either.Right(wallet)
//   } else {
//     let iterations = selectIterations(wallet)
//     let sharedKey = select(Lens.sharedKey, wallet)
//     let enc = Either.try(crypto.encryptSecPass(iterations, sharedKey, password))
//     let hash = crypto.hashNTimes(iterations, R.concat(sharedKey, password)).toString('hex')
//
//     let setFlag = map(over(Lens.doubleEncryption, () => true))
//     let setHash = map(over(Lens.dpasswordhash, () => hash))
//
//     return cipher(enc, wallet).map(compose(setHash, setFlag))
//   }
// })

// const checkFailure = str => str === '' ? Either.Left('DECRYPT_FAILURE') : Either.Right(str)

// decrypt :: str -> Wallet -> Either error Wallet
// export const decrypt = curry((password, wallet) => {
//   if (view(Lens.doubleEncryption, wallet)) {
//     // this is not supposed to be used for error handling.
//     // But we should notify the action dispatcher that he did something wrong
//     if (!isValidSecondPwd(password, wallet)) {
//       throw new Error('INVALID_SECOND_PASSWORD')
//     }
//     const iterations = view(compose(Lens.options, Lens.pbkdf2Iterations), wallet)
//     const sharedKey = view(Lens.sharedKey, wallet)
//     const tryDec = Either.try(decryptSecPass(sharedKey, iterations, password))
//     const dec = msg => tryDec(msg).chain(checkFailure)
//     const setFlag = over(Lens.doubleEncryption, () => false)
//     const setHash = over(Lens.dpasswordhash, () => null)
//     return cipher(dec, wallet).map(compose(setHash, setFlag))
//   } else {
//     return Either.Right(wallet)
//   }
// })

export default Wallet
