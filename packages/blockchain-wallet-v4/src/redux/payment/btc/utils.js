import {
  converge,
  equals,
  or,
  assoc,
  drop,
  curry,
  set,
  always,
  compose
} from 'ramda'
import * as Coin from '../../../coinSelection/coin'
import { Wallet, HDAccount, Address } from '../../../types'
import { isValidBitcoinAddress, getWifAddress } from '../../../utils/btc'
import * as S from '../../selectors'

// /////////////////////////////////////////////////////////////////////////////
// Validations
// isValidIndex :: Wallet -> Integer -> Boolean
export const isValidIndex = curry((wallet, index) =>
  Wallet.getAccount(index, wallet)
    .map(always(true))
    .getOrElse(false)
)

// isValidAddressOrIndex :: Wallet -> Any -> Boolean
export const isValidAddressOrIndex = curry((wallet, candidate) =>
  converge(or, [isValidBitcoinAddress, isValidIndex(wallet)])(candidate)
)

// /////////////////////////////////////////////////////////////////////////////
// From
export const ADDRESS_TYPES = {
  ACCOUNT: 'ACCOUNT',
  LEGACY: 'LEGACY',
  WATCH_ONLY: 'WATCH_ONLY',
  EXTERNAL: 'EXTERNAL',
  LOCKBOX: 'LOCKBOX',
  ADDRESS: 'ADDRESS',
  SCRIPT: 'SCRIPT'
}

// fromLegacy :: String -> Object
export const fromLegacy = address => ({
  fromType: ADDRESS_TYPES.LEGACY,
  from: [address],
  change: address
})

// fromLegacyList :: [String] -> Object
export const fromLegacyList = addresses => ({
  fromType: ADDRESS_TYPES.LEGACY,
  from: addresses,
  change: addresses[0]
})

// fromWatchOnly :: String -> String -> Object
export const fromWatchOnly = (address, wif) => ({
  fromType: ADDRESS_TYPES.WATCH_ONLY,
  from: [address],
  change: address,
  wifKeys: [wif]
})

// fromExternal :: String -> String -> String -> String -> Object
export const fromExternal = (addrComp, addrUncomp, wifComp, wifUncomp) => ({
  fromType: ADDRESS_TYPES.EXTERNAL,
  from: [addrComp, addrUncomp],
  change: addrComp,
  wifKeys: compose(
    assoc(addrComp, wifComp),
    assoc(addrUncomp, wifUncomp)
  )({})
})

// fromAccount :: Network -> ReduxState -> Object

export const fromAccount = (network, state, index, coin) => {
  const wallet = S.wallet.getWallet(state)
  let account = Wallet.getAccount(index, wallet).get()

  let changeIndex = equals(coin, 'BTC')
    ? S.data.bitcoin.getChangeIndex(account.xpub, state)
    : S.data.bch.getChangeIndex(account.xpub, state)
  let changeAddress = changeIndex
    .map(index => HDAccount.getChangeAddress(account, index, network))
    .getOrFail('missing_change_address')

  return {
    fromType: ADDRESS_TYPES.ACCOUNT,
    from: [account.xpub],
    change: changeAddress,
    fromAccountIdx: index
  }
}

export const fromLockbox = (network, state, xpub, coin) => {
  const account = equals(coin, 'BTC')
    ? S.kvStore.lockbox.getLockboxBtcAccount(state, xpub)
    : S.kvStore.lockbox.getLockboxBchAccount(state, xpub)
  let hdAccount = HDAccount.fromJS(account.getOrFail(), 0)

  let changeIndex = equals(coin, 'BTC')
    ? S.data.bitcoin.getChangeIndex(xpub, state)
    : S.data.bch.getChangeIndex(xpub, state)
  let changeAddress = changeIndex
    .map(index => HDAccount.getChangeAddress(hdAccount, index, network))
    .getOrFail('missing_change_address')

  return {
    fromType: ADDRESS_TYPES.LOCKBOX,
    from: [xpub],
    change: changeAddress,
    changeIndex: changeIndex.getOrElse(0)
  }
}

// fromPrivateKey :: Network -> Wallet -> ECKey -> Object
export const fromPrivateKey = (network, wallet, key) => {
  let c = getWifAddress(key, true)
  let u = getWifAddress(key, false)
  let isCompressedWatchOnly = Wallet.getAddress(c.address, wallet)
    .map(Address.isWatchOnly)
    .getOrElse(false)
  let isUncompressedWatchOnly = Wallet.getAddress(u.address, wallet)
    .map(Address.isWatchOnly)
    .getOrElse(false)

  // key corresponds to an uncompressed existing address
  if (isUncompressedWatchOnly) {
    return fromWatchOnly(u.address, u.wif)
  }
  // key corresponds to an compressed existing address
  if (isCompressedWatchOnly) {
    return fromWatchOnly(c.address, c.wif)
  }
  // key external to the wallet (we will spend from compressed and uncompressed)
  return fromExternal(c.address, u.address, c.wif, u.wif)
}

// toOutputAccount :: Coin -> String -> ReduxState -> Integer -> Object
export const toOutputAccount = (coin, network, state, accountIndex) => {
  const wallet = S.wallet.getWallet(state)
  const account = Wallet.getAccount(accountIndex, wallet).get() // throw if nothing
  const receiveIndexR =
    coin === 'BTC'
      ? S.data.bitcoin.getReceiveIndex(account.xpub, state)
      : S.data.bch.getReceiveIndex(account.xpub, state)
  const receiveIndex = receiveIndexR.getOrFail(
    new Error('missing_receive_address')
  )
  const address = HDAccount.getReceiveAddress(account, receiveIndex, network)
  return {
    type: ADDRESS_TYPES.ACCOUNT,
    address,
    accountIndex,
    addressIndex: receiveIndex
  }
}

// toLockBoxAccount :: Coin -> String -> ReduxState -> String -> Object
export const toLockboxAccount = (coin, network, state, xpub) => {
  const receiveIndexR =
    coin === 'BTC'
      ? S.data.bitcoin.getReceiveIndex(xpub, state)
      : S.data.bch.getReceiveIndex(xpub, state)

  const receiveIndex = receiveIndexR.getOrFail(
    new Error('missing_receive_address')
  )

  const address =
    coin === 'BTC'
      ? S.common.btc.getAddressLockbox(network, xpub, receiveIndex, state)
      : S.common.bch.getAddressLockbox(network, xpub, receiveIndex, state)
  return {
    type: ADDRESS_TYPES.LOCKBOX,
    address,
    xpub,
    addressIndex: receiveIndex
  }
}

// toOutputScript :: String -> Object
export const toOutputScript = script => ({
  type: ADDRESS_TYPES.SCRIPT,
  script
})

// toOutputAddress :: String -> Object
export const toOutputAddress = address => ({
  type: ADDRESS_TYPES.ADDRESS,
  address
})

// toOutputAccount :: Network -> ReduxState -> String|Integer -> String -> Object
export const toOutput = curry((coin, network, state, destination, type) => {
  switch (type) {
    case ADDRESS_TYPES.ACCOUNT:
      return toOutputAccount(coin, network, state, destination)
    case ADDRESS_TYPES.LOCKBOX: {
      return toLockboxAccount(coin, network, state, destination)
    }
    case ADDRESS_TYPES.SCRIPT: {
      return toOutputScript(destination)
    }
    default:
      return toOutputAddress(destination)
  }
})

// /////////////////////////////////////////////////////////////////////////////
// prepare Unspent Coins
export const toCoin = curry((network, fromData, input) => {
  switch (fromData.fromType) {
    case ADDRESS_TYPES.ACCOUNT:
      let path = input.xpub
        ? `${fromData.fromAccountIdx}${drop(1, input.xpub.path)}`
        : undefined
      return Coin.fromJS(assoc('path', path, input), network)
    case ADDRESS_TYPES.LEGACY:
      return Coin.fromJS(input, network)
    case ADDRESS_TYPES.LOCKBOX:
      return Coin.fromJS(assoc('path', input.xpub.path, input), network)
    case ADDRESS_TYPES.WATCH_ONLY:
      return Coin.fromJS(assoc('priv', fromData.wifKeys[0], input), network)
    case ADDRESS_TYPES.EXTERNAL:
      let coin = Coin.fromJS(input, network)
      let address = Coin.selectAddress(coin)
      return set(Coin.priv, fromData.wifKeys[address], coin)
    default:
      throw new Error('fromType_not_recognized')
  }
})
