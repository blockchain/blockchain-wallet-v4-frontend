import { Map, fromJS as IfromJS } from 'immutable-ext'
import Either from 'data.either'
import { compose, map ,over, view, curry } from 'ramda'
import { iso, mapped, traversed, traverseOf } from 'ramda-lens'
import * as Lens from '../lens'
import { encryptSecPass, decryptSecPass, hashNTimes } from '../WalletCrypto'

const addressMapCons = as => Map(as.map(a => [a.get('addr'), a]))
const addresses = over(Lens.addresses, addressMapCons)

const renameKeys = (o) => {
  o.addresses = o.keys;
  delete o.keys;
  return o;
}

const renameAddresses = (o) => {
  o.keys = o.addresses;
  delete o.addresses;
  return o;
}

const Wallet = compose(addresses, IfromJS, renameKeys)

// // /////////////////////////////////////////////////////////////////////////////
// // To JS support
// const labelsToList = over(Lens.hdwallets, map(HD.labelsToList))
const addressesToList = over(Lens.addresses, m => m.toList())
// export const toJS = compose(renameAddresses, (w) => w.toJS() ,addressesToList, labelsToList)
export const toJS = compose(renameAddresses, (w) => w.toJS() ,addressesToList)
export const fromJS = Wallet
// // more info about the isomorphism can be found here:
// // https://medium.com/@drboolean/lenses-with-immutable-js-9bda85674780#.s591lzg5v
//
// export const wIso = iso(toJS, fromJS)
// // view(wIso, w) :: wallet in pure js (can be used as a lens)
// // With over can be used to apply myFunction acting over pure javascript
// // and returning the immutable structure
// // over(wIso, myFunction, immWallet)

// /////////////////////////////////////////////////////////////////////////////
// second password support
// /////////////////////////////////////////////////////////////////////////////
// check that example to understand traverse:
// https://github.com/ramda/ramda-lens/commit/adb3ef830ef65d3b252e8c9b86b9659e9698cdba#diff-c1129c8b045390789fa8ff62f2c6b4a9R88
// cipher :: (str => str) -> Wallet -> Either error Wallet
export const cipher = curry((f, wallet) => {
  const trAddr = traverseOf(compose(Lens.addresses, traversed, Lens.priv), Either.of, f)
  const traSeed = traverseOf(compose(Lens.hdwallets, traversed, Lens.seedHex), Either.of, f)
  const traXpriv = traverseOf(compose(Lens.hdwallets, traversed, Lens.accounts, traversed, Lens.xpriv ), Either.of, f)
  return Either.Right(wallet).chain(trAddr).chain(traSeed).chain(traXpriv)
})

// encrypt :: str -> Wallet -> Either error Wallet
export const encrypt = curry((password, wallet) => {
  if(view(Lens.doubleEncryption, wallet)) {
    return Either.Right(wallet)
  } else {
    const iterations = view(compose(Lens.options, Lens.pbkdf2Iterations), wallet)
    const sharedKey = view(Lens.sharedKey, wallet)
    const enc = Either.try(encryptSecPass(sharedKey, iterations, password))
    const setFlag = over(Lens.doubleEncryption, () => true)
    const hash = hashNTimes(iterations, sharedKey + password).toString('hex')
    const setHash = over(Lens.dpasswordhash, () => hash)
    return cipher(enc, wallet).map(compose(setHash, setFlag))
  }
})

const checkFailure = str => str === "" ? Either.Left('DECRYPT_FAILURE') : Either.Right(str)

// decrypt :: str -> Wallet -> Either error Wallet
export const decrypt = curry((password, wallet) => {
  if(view(Lens.doubleEncryption, wallet)) {
    // this is not supposed to be used for error handling.
    // But we should notify the action dispatcher that he did something wrong
    if(! isValidSecondPwd(password, wallet)) {
      throw new Error('INVALID_SECOND_PASSWORD')
    }
    const iterations = view(compose(Lens.options, Lens.pbkdf2Iterations), wallet)
    const sharedKey = view(Lens.sharedKey, wallet)
    const tryDec = Either.try(decryptSecPass(sharedKey, iterations, password))
    const dec = msg => tryDec(msg).chain(checkFailure)
    const setFlag = over(Lens.doubleEncryption, () => false)
    const setHash = over(Lens.dpasswordhash, () => null)
    return cipher(dec, wallet).map(compose(setHash, setFlag))
  } else {
    return Either.Right(wallet)
  }
})

// isValidSecondPwd :: str -> Wallet -> Bool
export const isValidSecondPwd = curry((password, wallet) => {
  if(view(Lens.doubleEncryption, wallet)) {
    const iterations = view(compose(Lens.options, Lens.pbkdf2Iterations), wallet)
    const sharedKey = view(Lens.sharedKey, wallet)
    const storedHash = view(Lens.dpasswordhash, wallet)
    const computedHash = hashNTimes(iterations, sharedKey + password).toString('hex')
    return storedHash === computedHash
  } else {
    // there is no second password active
    return true
  }
})


// AddrEncrypt :: Number -> String -> String -> Address -> Address
const AddrEncrypt = curry((iterations, sharedKey, password, address) => {
  const cipher = encryptSecPass(sharedKey, iterations, password)
  return over(Lens.priv, cipher, address)
})


// /////////////////////////////////////////////////////////////////////////////
// add address (encrypted if needed)
// addAddress :: Wallet -> Address -> String -> Wallet
export const addAddress = curry((wallet, address, password) => {
  const it = view(compose(Lens.options, Lens.pbkdf2Iterations), wallet)
  const sk = view(Lens.sharedKey, wallet)
  const append = (a) => over(Lens.addresses, as => as.set(view(Lens.addr, a), a), wallet)
  if (!view(Lens.doubleEncryption ,wallet)) {
    return append(address)
  } else {
    if (isValidSecondPwd(password, wallet)) {
      return append(AddrEncrypt(it, sk, password, address))
    } else {
      throw new Error('INVALID_SECOND_PASSWORD')
    }
  }
})

export default Wallet
