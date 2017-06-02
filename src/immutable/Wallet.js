import { Map, List, fromJS as iFromJS } from 'immutable-ext'
import Either from 'data.either'
import Task from 'data.task'
import * as R from 'ramda'
const { compose, over, view, curry } = R
import { traversed, traverseOf } from 'ramda-lens'
import { iLensProp } from '../lens'
import * as crypto from '../WalletCrypto'
import * as AddressUtil from './Address'
import * as HDWalletUtil from './HDWallet'
import { typeDef, shift, shiftIProp } from '../util'

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

const { lens, guard, define } = typeDef(Wallet)

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
export const selectAddresses = compose((as) => as.toArray(), view(addresses))
export const selectHdWallets = view(hdWallets)
export const selectHdWallet = compose((xs) => xs.last(), selectHdWallets)
export const isDoubleEncrypted = compose(Boolean, view(doubleEncryption))

const shiftWallet = compose(shiftIProp('keys', 'addresses'), shift)

export const fromJS = (x) => {
  let addressesMapCons = compose(Map, R.indexBy(R.prop('addr')), R.map(AddressUtil.fromJS))
  let hdWalletListCons = compose(List, R.map(HDWalletUtil.fromJS))

  let walletCons = compose(
    over(hdWallets, hdWalletListCons),
    over(addresses, addressesMapCons)
  )

  return walletCons(new Wallet(shiftWallet(iFromJS(x)).forward()))
}

export const toJS = R.pipe(guard, (wallet) => {
  let selectAddressesJS = compose(R.map(AddressUtil.toJS), selectAddresses)
  let destructAddressses = R.set(addresses, selectAddressesJS(wallet))

  let selectHdWalletsJS = compose(R.map(HDWalletUtil.toJS), selectHdWallets)
  let destructHdWallets = R.set(hdWallets, selectHdWalletsJS(wallet))

  let destructWallet = compose(destructHdWallets, destructAddressses)
  return shiftWallet(destructWallet(wallet).__internal).back().toJS()
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

// addAddress :: Wallet -> Address -> String -> Either Error Wallet
export const addAddress = curry((wallet, address, password) => {
  let it = selectIterations(wallet)
  let sk = view(sharedKey, wallet)
  let set = curry((a, as) => as.set(a.addr, a))
  let append = curry((w, a) => over(addresses, set(a), w))
  if (!isDoubleEncrypted(wallet)) {
    return Either.of(append(wallet, address))
  } else if (isValidSecondPwd(password, wallet)) {
    return AddressUtil.encryptSync(it, sk, password, address).map(append(wallet))
  } else {
    return Either.Left(new Error('INVALID_SECOND_PASSWORD'))
  }
})

// setAddressLabel :: String -> String -> Wallet -> Wallet
export const setAddressLabel = curry((address, label, wallet) => {
  let addressLens = compose(addresses, iLensProp(address))
  return R.over(addressLens, AddressUtil.setLabel(label), wallet)
})

// traversePrivValues :: Monad m => (a -> m a) -> (String -> m String) -> Wallet -> m Wallet
export const traverseKeyValues = curry((of, f, wallet) => {
  const trAddr = traverseOf(compose(addresses, traversed, AddressUtil.priv), of, f)
  const trSeed = traverseOf(compose(hdWallets, traversed, HDWalletUtil.seedHex), of, f)
  const trXpriv = traverseOf(compose(hdWallets, traversed, HDWalletUtil.accounts, traversed, HDWalletUtil.xpriv), of, f)
  return of(wallet).chain(trAddr).chain(trSeed).chain(trXpriv)
})

// encryptMonadic :: Monad m => (a -> m a) -> (String -> m String) -> String -> Wallet -> m Wallet
export const encryptMonadic = curry((of, cipher, password, wallet) => {
  if (isDoubleEncrypted(wallet)) {
    return of(wallet)
  } else {
    let iter = selectIterations(wallet)
    let enc = cipher(wallet.sharedKey, iter, password)
    let hash = crypto.hashNTimes(iter, R.concat(wallet.sharedKey, password)).toString('hex')

    let setFlag = over(doubleEncryption, () => true)
    let setHash = over(dpasswordhash, () => hash)

    return traverseKeyValues(of, enc, wallet).map(compose(setHash, setFlag))
  }
})

// encrypt :: String -> Wallet -> Task Error Wallet
export const encrypt = encryptMonadic(
  Task.of,
  crypto.encryptSecPass
)

// encryptSync :: String -> Wallet -> Either Error Wallet
export const encryptSync = encryptMonadic(
  Either.of,
  crypto.encryptSecPassSync
)

// decryptMonadic :: Monad m => (a -> m a) -> (String -> m String) -> (String -> m Wallet) -> String -> Wallet -> m Wallet
export const decryptMonadic = curry((of, cipher, verify, password, wallet) => {
  if (isDoubleEncrypted(wallet)) {
    let iter = selectIterations(wallet)
    let dec = cipher(wallet.sharedKey, iter, password)

    let setFlag = over(doubleEncryption, () => false)
    let setHash = over(lens, (x) => x.delete('dpasswordhash'))

    return verify(password, wallet).chain(traverseKeyValues(of, dec)).map(compose(setHash, setFlag))
  } else {
    return of(wallet)
  }
})

// validateSecondPwd -> (a -> m a) -> (a -> m b) -> String -> Wallet
const validateSecondPwd = curry((pass, fail, password, wallet) =>
  isValidSecondPwd(password, wallet) ? pass(wallet) : fail(new Error('INVALID_SECOND_PASSWORD'))
)

// decrypt :: String -> Wallet -> Task Error Wallet
export const decrypt = decryptMonadic(
  Task.of,
  crypto.decryptSecPass,
  validateSecondPwd(Task.of, Task.rejected)
)

// decryptSync :: String -> Wallet -> Either Error Wallet
export const decryptSync = decryptMonadic(
  Either.of,
  crypto.decryptSecPassSync,
  validateSecondPwd(Either.of, Either.Left)
)

export const createNew = curry((guid, sharedKey, mnemonic) => {
  let hd = HDWalletUtil.createNew(mnemonic)

  return fromJS({
    guid,
    sharedKey,
    options: {
      pbkdf2_iterations: 5000,
      fee_per_kb: 10000,
      html5_notifications: false,
      logout_time: 600000
    },
    tx_notes: {},
    tx_names: [],
    double_encryption: false,
    address_book: [],
    keys: [],
    hd_wallets: [HDWalletUtil.toJS(hd)]
  })
})

export default Wallet
