import Bigi from 'bigi'
import Base58 from 'bs58'
import Either from 'data.either'
import Task from 'data.task'
import Bitcoin from 'bitcoinjs-lib'
import memoize from 'fast-memoize'
import BIP39 from 'bip39'
import { compose, curry, map, is, pipe, __, concat, split, isNil } from 'ramda'
import { traversed, traverseOf, over, view, set } from 'ramda-lens'
import * as crypto from '../walletCrypto'
import { shift, shiftIProp } from './util'
import Type from './Type'
import * as HDWallet from './HDWallet'
import * as HDAccount from './HDAccount'
import * as Address from './Address'
import * as AddressMap from './AddressMap'
// import * as AddressLabel from './AddressLabel'
import * as AddressLabelMap from './AddressLabelMap'
import * as HDWalletList from './HDWalletList'
import * as HDAccountList from './HDAccountList'
import * as AddressBook from './AddressBook'
import * as TXNames from './TXNames'
import * as TXNotes from './TXNotes'
import * as Options from './Options'

/* Wallet :: {
  guid :: String
  sharedKey :: String
  double_encryption :: Bool
  metadataHDNode :: String
  options :: Options
  address_book :: [{ [addr]: String }]
  tx_notes :: [{ txhash: String }]
  tx_names :: []
  addresses :: {Address}
  hd_wallets :: [HDWallet]
} */

export class Wallet extends Type {}

export const isWallet = is(Wallet)

export const guid = Wallet.define('guid')
export const sharedKey = Wallet.define('sharedKey')
export const doubleEncryption = Wallet.define('double_encryption')
export const metadataHDNode = Wallet.define('metadataHDNode')
export const options = Wallet.define('options')
export const addresses = Wallet.define('addresses')
export const dpasswordhash = Wallet.define('dpasswordhash')
export const hdWallets = Wallet.define('hd_wallets')
export const txNotes = Wallet.define('tx_notes')
export const txNames = Wallet.define('tx_names')
export const addressBook = Wallet.define('address_book')

export const selectGuid = view(guid)
export const selectSharedKey = view(sharedKey)
export const selectOptions = view(options)
export const selectmetadataHDNode = view(metadataHDNode)
export const selectTxNotes = view(txNotes)
export const selectTxNames = view(txNames)
export const selectAddressBook = view(addressBook)
export const selectIterations = compose(Options.selectPbkdf2Iterations, selectOptions)

export const selectAddresses = view(addresses)
export const selectHdWallets = view(hdWallets)
export const isDoubleEncrypted = compose(Boolean, view(doubleEncryption))

export const selectArchivedContext = compose(AddressMap.selectContext, AddressMap.selectActive, selectAddresses)
export const selectAddrContext = compose(AddressMap.selectContext, AddressMap.selectActive, selectAddresses)
export const selectXpubsContext = compose(HDWallet.selectContext, HDWalletList.selectHDWallet, selectHdWallets)
export const selectHDAccounts = w => selectHdWallets(w).flatMap(HDWallet.selectAccounts)
export const selectContext = w => selectAddrContext(w).concat(selectXpubsContext(w))

const shiftWallet = compose(shiftIProp('keys', 'addresses'), shift)

export const fromJS = (x) => {
  if (is(Wallet, x)) { return x }
  const walletCons = compose(
    over(hdWallets, HDWalletList.fromJS),
    over(addresses, AddressMap.fromJS),
    over(options, Options.fromJS),
    over(txNames, TXNames.fromJS),
    over(txNotes, TXNotes.fromJS),
    over(addressBook, AddressBook.fromJS),
    w => shiftWallet(w).forward()
  )
  return walletCons(new Wallet(x))
}

export const toJS = pipe(Wallet.guard, (wallet) => {
  const walletDecons = compose(
    w => shiftWallet(w).back(),
    over(options, Options.toJS),
    over(txNotes, TXNotes.toJS),
    over(txNames, TXNames.toJS),
    over(hdWallets, HDWalletList.toJS),
    over(addresses, AddressMap.toJS),
    over(addressBook, AddressBook.toJS)
  )
  return walletDecons(wallet).toJS()
})

export const reviver = (jsObject) => {
  return new Wallet(jsObject)
}

// fromEncryptedPayload :: String -> String -> Either Error Wallet
export const fromEncryptedPayload = curry((password, payload) => {
  let decryptWallet = compose(
    map(fromJS),
    crypto.decryptWallet(password),
    JSON.parse
  )
  return Either.of(payload).chain(decryptWallet)
})

// toEncryptedPayload :: String -> Wallet -> Either Error String
export const toEncryptedPayload = curry((password, wallet) => {
  Wallet.guard(wallet)
  let iters = selectIterations(wallet)
  let encryptWallet = compose(
    Either.try(crypto.encryptWallet(__, password, iters, 3.0)),
    JSON.stringify,
    toJS
  )
  return Either.of(wallet).chain(encryptWallet)
})

// isValidSecondPwd :: String -> Wallet -> Bool
export const isValidSecondPwd = curry((password, wallet) => {
  if (isDoubleEncrypted(wallet)) {
    if (!is(String, password)) { return false }
    let iter = selectIterations(wallet)
    let sk = view(sharedKey, wallet)
    let storedHash = view(dpasswordhash, wallet)
    let computedHash = crypto.hashNTimes(iter, concat(sk, password)).toString('hex')
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
    return Address.encryptSync(it, sk, password, address).map(append(wallet))
  } else {
    return Either.Left(new Error('INVALID_SECOND_PASSWORD'))
  }
})

// setLegacyAddressLabel :: String -> String -> Wallet -> Wallet
export const setLegacyAddressLabel = curry((address, label, wallet) => {
  const addressLens = compose(addresses, AddressMap.address(address))
  const eitherW = Either.try(over(addressLens, Address.setLabel(label)))(wallet)
  return eitherW.getOrElse(wallet)
})

// archiveAddress :: String -> Wallet -> Wallet
export const archiveAddress = curry((address, wallet) => {
  const addressLens = compose(addresses, AddressMap.address(address))
  const eitherW = Either.try(over(addressLens, Address.archive))(wallet)
  return eitherW.getOrElse(wallet)
})

// deleteLegacyAddress :: String -> Wallet -> Wallet
export const deleteLegacyAddress = curry((address, wallet) => {
  return over(addresses, AddressMap.deleteAddress(address), wallet)
})

// setHdAddressLabel :: Number -> Number -> Wallet -> Wallet
export const deleteHdAddressLabel = curry((accountIdx, addressIdx, wallet) => {
  const lens = compose(hdWallets,
                       HDWalletList.hdwallet,
                       HDWallet.accounts,
                       HDAccountList.account(accountIdx),
                       HDAccount.addressLabels)
  const eitherW = Either.try(over(lens, AddressLabelMap.deleteLabel(addressIdx)))(wallet)
  return eitherW.getOrElse(wallet)
})

// setHdAddressLabel :: Number -> Number -> String -> Wallet -> Wallet
export const setHdAddressLabel = curry((accountIdx, addressIdx, label, wallet) => {
  const lens = compose(hdWallets,
                       HDWalletList.hdwallet,
                       HDWallet.accounts,
                       HDAccountList.account(accountIdx),
                       HDAccount.addressLabels)
  const eitherW = Either.try(over(lens, AddressLabelMap.setLabel(addressIdx, label)))(wallet)
  return eitherW.getOrElse(wallet)
})

// traversePrivValues :: Monad m => (a -> m a) -> (String -> m String) -> Wallet -> m Wallet
export const traverseKeyValues = curry((of, f, wallet) => {
  const trAddr = traverseOf(compose(addresses, traversed, Address.priv), of, f)
  const trSeed = traverseOf(compose(hdWallets, traversed, HDWallet.seedHex), of, f)
  const trXpriv = traverseOf(compose(hdWallets, traversed, HDWallet.accounts, traversed, HDAccount.xpriv), of, f)
  return of(wallet).chain(trAddr).chain(trSeed).chain(trXpriv)
})

// encryptMonadic :: Monad m => (a -> m a) -> (String -> m String) -> String -> Wallet -> m Wallet
export const encryptMonadic = curry((of, cipher, password, wallet) => {
  if (isDoubleEncrypted(wallet)) {
    return of(wallet)
  } else {
    let iter = selectIterations(wallet)
    let enc = cipher(wallet.sharedKey, iter, password)
    let hash = crypto.hashNTimes(iter, concat(wallet.sharedKey, password)).toString('hex')
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
    let setHash = over(Wallet.lens, (x) => x.delete('dpasswordhash'))

    return verify(password, wallet).chain(traverseKeyValues(of, dec)).map(compose(setHash, setFlag))
  } else {
    return of(wallet)
  }
})

// validateSecondPwd :: (a -> m a) -> (a -> m b) -> String -> Wallet
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

const _derivePrivateKey = (network, xpriv, chain, index) => {
  return Bitcoin.HDNode.fromBase58(xpriv, network).derive(chain).derive(index)
}
export const derivePrivateKey = memoize(_derivePrivateKey)

export const getHDPrivateKey = curry((keypath, secondPassword, network, wallet) => {
  let [accId, chain, index] = map(parseInt, split('/', keypath))
  if (isNil(accId) || isNil(chain) || isNil(index)) { return Task.rejected('WRONG_PATH_KEY') }
  let xpriv = compose(HDAccount.selectXpriv, HDWallet.selectAccount(accId), HDWalletList.selectHDWallet, selectHdWallets)(wallet)
  if (isDoubleEncrypted(wallet)) {
    return validateSecondPwd(Task.of, Task.rejected)(secondPassword, wallet)
           .chain(() => crypto.decryptSecPass(selectSharedKey(wallet), selectIterations(wallet), secondPassword, xpriv))
           .map(xp => derivePrivateKey(network, xp, chain, index).keyPair)
  } else {
    return Task.of(xpriv).map(xp => derivePrivateKey(network, xp, chain, index).keyPair)
  }
})


// TODO :: find a proper place for that
const fromBase58toKey = (string, network) =>
  new Bitcoin.ECPair(Bigi.fromBuffer(Base58.decode(string)), null, { network })

export const getLegacyPrivateKey = curry((address, secondPassword, network, wallet) => {
  let priv = compose(Address.selectPriv, AddressMap.selectAddress(address), selectAddresses)(wallet)
  if (isDoubleEncrypted(wallet)) {
    return validateSecondPwd(Task.of, Task.rejected)(secondPassword, wallet)
           .chain(() => crypto.decryptSecPass(selectSharedKey(wallet), selectIterations(wallet), secondPassword, priv))
           .map(pk => fromBase58toKey(pk, network))
  } else {
    return Task.of(priv).map(pk => fromBase58toKey(pk, network))
  }
})

export const getMnemonic = curry((secondPassword, wallet) => {
  const entropyToMnemonic = Either.try(BIP39.entropyToMnemonic)
  let seedHex = compose(HDWallet.selectSeedHex, HDWalletList.selectHDWallet, selectHdWallets)(wallet)
  if (isDoubleEncrypted(wallet)) {
    return validateSecondPwd(Either.of, Either.Left)(secondPassword, wallet)
           .chain(() => crypto.decryptSecPassSync(selectSharedKey(wallet), selectIterations(wallet), secondPassword, seedHex))
           .chain(entropyToMnemonic)
  } else {
    return entropyToMnemonic(seedHex)
  }
})

export const js = (guid, sharedKey, label, mnemonic, xpub, nAccounts, network) => ({
  guid: guid,
  sharedKey: sharedKey,
  tx_names: [],
  tx_notes: {},
  double_encryption: false,
  address_book: [],
  keys: [],
  hd_wallets: [HDWallet.js(label, mnemonic, xpub, nAccounts, network)],
  options: Options.js()
})
