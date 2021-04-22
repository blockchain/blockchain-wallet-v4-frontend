import BIP39 from 'bip39'
import * as Bitcoin from 'bitcoinjs-lib'
import Base58 from 'bs58'
import Either from 'data.either'
import Maybe from 'data.maybe'
import Task from 'data.task'
import memoize from 'fast-memoize'
import {
  __,
  compose,
  concat,
  curry,
  flip,
  is,
  isNil,
  map,
  pipe,
  split
} from 'ramda'
import { over, set, traversed, traverseOf, view } from 'ramda-lens'

import * as utils from '../utils'
import * as crypto from '../walletCrypto'
import * as Address from './Address'
import * as AddressBook from './AddressBook'
import * as AddressLabelMap from './AddressLabelMap'
import * as AddressMap from './AddressMap'
import * as HDAccount from './HDAccount_DEPRECATED_V3'
import * as HDAccountList from './HDAccountList_DEPRECATED_V3'
import * as HDWallet from './HDWallet_DEPRECATED_V3'
import * as HDWalletList from './HDWalletList_DEPRECATED_V3'
import * as Options from './Options'
import * as TXNames from './TXNames'
import * as TXNotes from './TXNotes'
import Type from './Type'
import { shift, shiftIProp } from './util'

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

export const hdwallet = compose(hdWallets, HDWalletList.hdwallet)
export const accounts = compose(hdwallet, HDWallet.accounts)

export const selectGuid = view(guid)
export const selectSharedKey = view(sharedKey)
export const selectOptions = view(options)
export const selectmetadataHDNode = view(metadataHDNode)
export const selectTxNotes = view(txNotes)
export const selectTxNames = view(txNames)
export const selectAddressBook = view(addressBook)
export const selectIterations = compose(
  Options.selectPbkdf2Iterations,
  selectOptions
)

export const selectHdWallets = view(hdWallets)
export const selectAddresses = compose(
  AddressMap.selectSpendable,
  view(addresses)
)
export const isDoubleEncrypted = compose(Boolean, view(doubleEncryption))

export const selectAddrContext = compose(
  AddressMap.selectContext,
  AddressMap.selectActive,
  selectAddresses
)
export const selectXpubsContext = compose(
  HDWallet.selectContext,
  HDWalletList.selectHDWallet,
  selectHdWallets
)
export const selectSpendableAddrContext = compose(
  AddressMap.selectContext,
  AddressMap.selectSpendable,
  selectAddresses
)
export const selectContext = w =>
  selectAddrContext(w).concat(selectXpubsContext(w))
export const selectHDAccounts = w =>
  selectHdWallets(w).flatMap(HDWallet.selectAccounts)
export const selectSpendableContext = w =>
  selectSpendableAddrContext(w).concat(selectXpubsContext(w))

const shiftWallet = compose(shiftIProp('keys', 'addresses'), shift)

export const fromJS = x => {
  if (is(Wallet, x)) {
    return x
  }
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

export const toJS = pipe(Wallet.guard, wallet => {
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

export const reviver = jsObject => {
  return new Wallet(jsObject)
}

export const spendableActiveAddresses = wallet => {
  let isSpendableActive = a => !Address.isWatchOnly(a) && !Address.isArchived(a)
  return selectAddresses(wallet)
    .filter(isSpendableActive)
    .map(a => a.addr)
}

// fromEncryptedPayload :: String -> String -> Task Error Wallet
export const fromEncryptedPayload = curry((password, payload) => {
  return Task.of(payload)
    .chain(crypto.decryptWallet(password))
    .map(fromJS)
})

// toEncryptedPayload :: String -> Wallet -> Task Error String
export const toEncryptedPayload = curry(
  (password, pbkdf2Iterations, wallet) => {
    Wallet.guard(wallet)
    return compose(
      crypto.encryptWallet(__, password, pbkdf2Iterations, 3.0),
      JSON.stringify,
      toJS
    )(wallet)
  }
)

// isValidSecondPwd :: String -> Wallet -> Bool
export const isValidSecondPwd = curry((password, wallet) => {
  if (isDoubleEncrypted(wallet)) {
    if (!is(String, password)) {
      return false
    }
    // 5000 is fallback for v1 wallets that are missing
    // Pbkdf2 Iterations in the inner wrapper of JSON
    let iter = selectIterations(wallet) || 5000
    let sk = view(sharedKey, wallet)
    let storedHash = view(dpasswordhash, wallet)
    let computedHash = crypto
      .hashNTimes(iter, concat(sk, password))
      .toString('hex')
    return storedHash === computedHash
  } else {
    return true
  }
})

// getAddress :: String -> Wallet -> Maybe Address
export const getAddress = curry((addr, wallet) => {
  let address = AddressMap.selectAddress(addr, wallet.addresses)
  return Maybe.fromNullable(address)
})

// getAccount :: Integer -> Wallet -> Maybe HDAccount
export const getAccount = curry((index, wallet) =>
  compose(
    Maybe.fromNullable,
    selectHdWallets
  )(wallet)
    .chain(compose(Maybe.fromNullable, HDWalletList.selectHDWallet))
    .chain(compose(Maybe.fromNullable, HDWallet.selectAccount(index)))
)

// applyCipher :: Wallet -> String -> Cipher -> a -> Task Error a
const applyCipher = curry((wallet, password, f, value) => {
  let it = selectIterations(wallet)
  let sk = view(sharedKey, wallet)
  switch (true) {
    case !isDoubleEncrypted(wallet):
      return Task.of(value)
    case isValidSecondPwd(password, wallet):
      return f(it, sk, password, value)
    default:
      return Task.rejected(new Error('INVALID_SECOND_PASSWORD'))
  }
})

// importLegacyAddress :: Wallet -> String -> Number -> String? -> { Network, Api } -> Task Error Wallet
export const importLegacyAddress = curry(
  (wallet, key, createdTime, password, bipPass, label, { api, network }) => {
    let checkIfExists = address =>
      getAddress(address.addr, wallet)
        .map(existing =>
          Address.isWatchOnly(existing) && !Address.isWatchOnly(address)
            ? Task.of(existing)
            : Task.rejected(new Error('present_in_wallet'))
        )
        .map(aE => aE.map(set(Address.priv, address.priv)))
        .getOrElse(Task.of(address))

    let appendAddress = address =>
      over(addresses, as => as.set(address.addr, address), wallet)

    return Address.fromString(key, createdTime, label, bipPass, {
      network,
      api
    })
      .chain(checkIfExists)
      .chain(applyCipher(wallet, password, Address.encrypt))
      .map(appendAddress)
  }
)

// upgradeToV3 :: String -> String -> String? -> Task Error Wallet
export const upgradeToV3 = curry(
  (mnemonic, firstLabel, password, network, wallet) => {
    return newHDWallet(mnemonic, password, wallet).chain(
      newHDAccount(firstLabel, password, network)
    )
  }
)

// upgradeToHd :: String -> String -> String? -> Task Error Wallet
export const upgradeToV4 = curry(
  (mnemonic, firstLabel, password, network, wallet) => {
    return 'NOT IMPLEMENTED!!! This is not the correct wallet file.'
  }
)

// newHDWallet :: String -> String? -> Wallet -> Task Error Wallet
export const newHDWallet = curry((mnemonic, password, wallet) => {
  let hdWallet = HDWallet.createNew(mnemonic)
  let appendHdWallet = curry((w, hd) =>
    over(hdWallets, list => list.push(hd), w)
  )
  return applyCipher(wallet, password, HDWallet.encrypt, hdWallet).map(
    appendHdWallet(wallet)
  )
})

// newHDAccount :: String -> String? -> Wallet -> Task Error Wallet
export const newHDAccount = curry((label, password, network, wallet) => {
  let hdWallet = HDWalletList.selectHDWallet(selectHdWallets(wallet))
  let index = hdWallet.accounts.size
  let appendAccount = curry((w, account) => {
    let accountsLens = compose(
      hdWallets,
      HDWalletList.hdwallet,
      HDWallet.accounts
    )
    let accountWithIndex = set(HDAccount.index, index, account)
    return over(accountsLens, accounts => accounts.push(accountWithIndex), w)
  })
  return applyCipher(
    wallet,
    password,
    flip(crypto.decryptSecPass),
    hdWallet.seedHex
  )
    .map(HDWallet.generateAccount(index, label, network))
    .chain(applyCipher(wallet, password, HDAccount.encrypt))
    .map(appendAccount(wallet))
})

// setLegacyAddressLabel :: String -> String -> Wallet -> Wallet
export const setLegacyAddressLabel = curry((address, label, wallet) => {
  const addressLens = compose(addresses, AddressMap.address(address))
  const eitherW = Either.try(over(addressLens, Address.setLabel(label)))(wallet)
  return eitherW.getOrElse(wallet)
})

// getPrivateKeyForAddress :: Wallet -> String? -> String -> Task Error String
export const getPrivateKeyForAddress = curry((wallet, password, addr) => {
  let address = AddressMap.selectAddress(addr, selectAddresses(wallet))
  return applyCipher(wallet, password, Address.decrypt, address).map(
    a => a.priv
  )
})

// setLegacyAddressLabel :: String -> Bool -> Wallet -> Wallet
export const setAddressArchived = curry((address, archived, wallet) => {
  const addressLens = compose(addresses, AddressMap.address(address))
  return over(addressLens, Address.setArchived(archived), wallet)
})

// deleteLegacyAddress :: String -> Wallet -> Wallet
export const deleteLegacyAddress = curry((address, wallet) => {
  return over(addresses, AddressMap.deleteAddress(address), wallet)
})

// deleteHdAddressLabel :: Number -> Number -> Wallet -> Wallet
export const deleteHdAddressLabel = curry((accountIdx, addressIdx, wallet) => {
  const lens = compose(
    hdWallets,
    HDWalletList.hdwallet,
    HDWallet.accounts,
    HDAccountList.account(accountIdx),
    HDAccount.addressLabels
  )
  const eitherW = Either.try(
    over(lens, AddressLabelMap.deleteLabel(addressIdx))
  )(wallet)
  return eitherW.getOrElse(wallet)
})

// setHdAddressLabel :: Number -> Number -> String -> Wallet -> Wallet
export const setHdAddressLabel = curry(
  (accountIdx, addressIdx, label, wallet) => {
    const lens = compose(
      hdWallets,
      HDWalletList.hdwallet,
      HDWallet.accounts,
      HDAccountList.account(accountIdx),
      HDAccount.addressLabels
    )
    const eitherW = Either.try(
      over(lens, AddressLabelMap.setLabel(addressIdx, label))
    )(wallet)
    return eitherW.getOrElse(wallet)
  }
)

// setAccountLabel :: Number -> String -> Wallet -> Wallet
export const setAccountLabel = curry((accountIdx, label, wallet) => {
  let lens = compose(
    accounts,
    HDAccountList.account(accountIdx),
    HDAccount.label
  )
  return set(lens, label, wallet)
})

// setAccountArchived :: Number -> Bool -> Wallet -> Wallet
export const setAccountArchived = curry((index, archived, wallet) => {
  let lens = compose(accounts, HDAccountList.account(index), HDAccount.archived)
  return set(lens, archived, wallet)
})

// setDefaultAccountIdx :: Number -> Wallet -> Wallet
export const setDefaultAccountIdx = curry((index, wallet) => {
  return set(compose(hdwallet, HDWallet.defaultAccountIdx), index, wallet)
})
export const setTxNote = curry((txHash, txNote, wallet) => {
  return set(compose(txNotes, TXNotes.note(txHash)), txNote, wallet)
})

// traversePrivValues :: Monad m => (a -> m a) -> (String -> m String) -> Wallet -> m Wallet
export const traverseKeyValues = curry((of, f, wallet) => {
  const trAddr = traverseOf(compose(addresses, traversed, Address.priv), of, f)
  const trSeed = traverseOf(
    compose(hdWallets, traversed, HDWallet.seedHex),
    of,
    f
  )
  const trXpriv = traverseOf(
    compose(
      hdWallets,
      traversed,
      HDWallet.accounts,
      traversed,
      HDAccount.xpriv
    ),
    of,
    f
  )
  return of(wallet)
    .chain(trAddr)
    .chain(trSeed)
    .chain(trXpriv)
})

// encryptMonadic :: Monad m => (a -> m a) -> (String -> m String) -> String -> Wallet -> m Wallet
export const encryptMonadic = curry((of, cipher, password, wallet) => {
  if (isDoubleEncrypted(wallet)) {
    return of(wallet)
  } else {
    let iter = selectIterations(wallet)
    let enc = cipher(wallet.sharedKey, iter, password)
    let hash = crypto
      .hashNTimes(iter, concat(wallet.sharedKey, password))
      .toString('hex')
    let setFlag = over(doubleEncryption, () => true)
    let setHash = over(dpasswordhash, () => hash)
    return traverseKeyValues(of, enc, wallet).map(compose(setHash, setFlag))
  }
})

// encrypt :: String -> Wallet -> Task Error Wallet
export const encrypt = encryptMonadic(Task.of, crypto.encryptSecPass)

// decryptMonadic :: Monad m => (a -> m a) -> (String -> m String) -> (String -> m Wallet) -> String -> Wallet -> m Wallet
export const decryptMonadic = curry((of, cipher, verify, password, wallet) => {
  if (isDoubleEncrypted(wallet)) {
    let iter = selectIterations(wallet)
    let dec = cipher(wallet.sharedKey, iter, password)

    let setFlag = over(doubleEncryption, () => false)
    let setHash = over(Wallet.lens, x => x.delete('dpasswordhash'))

    return verify(password, wallet)
      .chain(traverseKeyValues(of, dec))
      .map(compose(setHash, setFlag))
  } else {
    return of(wallet)
  }
})

// validateSecondPwd :: (a -> m a) -> (a -> m b) -> String -> Wallet
const validateSecondPwd = curry((pass, fail, password, wallet) =>
  isValidSecondPwd(password, wallet)
    ? pass(wallet)
    : fail(new Error('INVALID_SECOND_PASSWORD'))
)

// decrypt :: String -> Wallet -> Task Error Wallet
export const decrypt = decryptMonadic(
  Task.of,
  crypto.decryptSecPass,
  validateSecondPwd(Task.of, Task.rejected)
)

const _derivePrivateKey = (network, xpriv, chain, index) =>
  Bitcoin.bip32
    .fromBase58(xpriv, network)
    .derive(chain)
    .derive(index)

export const derivePrivateKey = memoize(_derivePrivateKey)

export const getHDPrivateKeyWIF = curry(
  (keypath, secondPassword, network, wallet) => {
    let [accId, chain, index] = map(parseInt, split('/', keypath))
    if (isNil(accId) || isNil(chain) || isNil(index)) {
      return Task.rejected('WRONG_PATH_KEY')
    }
    let xpriv = compose(
      HDAccount.selectXpriv,
      HDWallet.selectAccount(accId),
      HDWalletList.selectHDWallet,
      selectHdWallets
    )(wallet)
    if (isDoubleEncrypted(wallet)) {
      return validateSecondPwd(Task.of, Task.rejected)(secondPassword, wallet)
        .chain(() =>
          crypto.decryptSecPass(
            selectSharedKey(wallet),
            selectIterations(wallet),
            secondPassword,
            xpriv
          )
        )
        .map(xp => {
          const node = derivePrivateKey(network, xp, chain, index)
          return Bitcoin.ECPair.fromPrivateKey(node.privateKey).toWIF()
        })
    } else {
      return Task.of(xpriv).map(xp => {
        const node = derivePrivateKey(network, xp, chain, index)
        return Bitcoin.ECPair.fromPrivateKey(node.privateKey).toWIF()
      })
    }
  }
)

// TODO :: find a proper place for that
const fromBase58toKey = (string, address, network) => {
  var key = Bitcoin.ECPair.fromPrivateKey(Base58.decode(string))
  if (utils.btc.keyPairToAddress(key) === address) return key
  key.compressed = !key.compressed
  return key
}

export const getLegacyPrivateKey = curry(
  (address, secondPassword, network, wallet) => {
    let priv = compose(
      Address.selectPriv,
      AddressMap.selectAddress(address),
      selectAddresses
    )(wallet)
    if (isDoubleEncrypted(wallet)) {
      return validateSecondPwd(Task.of, Task.rejected)(secondPassword, wallet)
        .chain(() =>
          crypto.decryptSecPass(
            selectSharedKey(wallet),
            selectIterations(wallet),
            secondPassword,
            priv
          )
        )
        .map(pk => fromBase58toKey(pk, address, network))
    } else {
      return Task.of(priv).map(pk => fromBase58toKey(pk, address, network))
    }
  }
)

export const getLegacyPrivateKeyWIF = curry(
  (address, secondPassword, network, wallet) => {
    return getLegacyPrivateKey(
      address,
      secondPassword,
      network,
      wallet
    ).map(ecpair => ecpair.toWIF())
  }
)

// getSeedHex :: String -> Wallet -> Task Error String
export const getSeedHex = curry((secondPassword, wallet) => {
  const seedHex = compose(
    HDWallet.selectSeedHex,
    HDWalletList.selectHDWallet,
    selectHdWallets
  )(wallet)
  if (isDoubleEncrypted(wallet)) {
    return validateSecondPwd(Task.of, Task.rejected)(
      secondPassword,
      wallet
    ).chain(() =>
      crypto.decryptSecPass(
        selectSharedKey(wallet),
        selectIterations(wallet),
        secondPassword,
        seedHex
      )
    )
  } else {
    return Task.of(seedHex)
  }
})

// getMnemonic :: String -> Wallet -> Task Error String
export const getMnemonic = curry((secondPassword, wallet) => {
  const eitherToTask = e => e.fold(Task.rejected, Task.of)
  const entropyToMnemonic = compose(
    eitherToTask,
    Either.try(BIP39.entropyToMnemonic)
  )
  const seedHex = getSeedHex(secondPassword, wallet)
  return seedHex.chain(entropyToMnemonic)
})

export const js = (guid, sharedKey, label, mnemonic, nAccounts, network) => ({
  guid: guid,
  sharedKey: sharedKey,
  tx_names: [],
  tx_notes: {},
  double_encryption: false,
  address_book: [],
  keys: [],
  hd_wallets: [HDWallet.js(label, mnemonic, nAccounts, network)],
  options: Options.js()
})
