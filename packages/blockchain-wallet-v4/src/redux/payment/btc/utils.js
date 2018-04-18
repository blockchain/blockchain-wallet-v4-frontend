import { converge, or, assoc, drop, curry, set, always } from 'ramda'
import * as Coin from '../../../coinSelection/coin'
import { Wallet, HDAccount, Address } from '../../../types'
import { isPositiveInteger } from '../../../utils/checks'
import { isValidBitcoinAddress, getWifAddress } from '../../../utils/bitcoin'
import * as S from '../../selectors'

// /////////////////////////////////////////////////////////////////////////////
// Validations
// isValidIndex :: Wallet -> Integer -> Boolean
export const isValidIndex = curry((wallet, index) =>
  Wallet.getAccount(index, wallet)
    .map(always(true)).getOrElse(false))

// isValidAddressOrIndex :: Wallet -> Any -> Boolean
export const isValidAddressOrIndex = curry((wallet, candidate) =>
  converge(or, [isValidBitcoinAddress, isValidIndex(wallet)])(candidate))

// /////////////////////////////////////////////////////////////////////////////
// From
export const FROM = {
  ACCOUNT: 'FROM.ACCOUNT',
  LEGACY: 'FROM.LEGACY',
  WATCH_ONLY: 'FROM.WATCH_ONLY',
  EXTERNAL: 'FROM.EXTERNAL'
}

// fromLegacy :: String -> Object
export const fromLegacy = address =>
  ({ fromType: FROM.LEGACY, from: [address], change: address })

// fromLegacyList :: [String] -> Object
export const fromLegacyList = addresses =>
  ({ fromType: FROM.LEGACY, from: addresses, change: addresses[0] })

// fromWatchOnly :: String -> String -> Object
export const fromWatchOnly = (address, wif) => ({
  fromType: FROM.WATCH_ONLY,
  from: [address],
  change: address,
  wifKeys: [wif]
})

// fromExternal :: String -> String -> String -> String -> Object
export const fromExternal = (addrComp, addrUncomp, wifComp, wifUncomp) => ({
  from: [addrComp, addrUncomp],
  change: addrComp,
  wifKeys: [wifComp, wifUncomp]
})

// fromAccount :: Network -> ReduxState -> Object
export const fromAccount = (network, state, index) => {
  const wallet = S.wallet.getWallet(state)
  let account = Wallet.getAccount(index, wallet).get()
  let changeAddress = S.data.bitcoin.getReceiveIndex(account.xpub, state)
    .map((index) => HDAccount.getChangeAddress(account, index, network))
    .getOrFail(new Error('missing_change_address'))
  return {
    fromType: FROM.ACCOUNT,
    from: [account.xpub],
    change: changeAddress,
    fromAccountIdx: index
  }
}

// fromPrivateKey :: Network -> Wallet -> ECKey -> Object
export const fromPrivateKey = (network, wallet, key) => {
  let c = getWifAddress(key, true)
  let u = getWifAddress(key, false)
  let isCompressedWatchOnly = Wallet.getAddress(c.address, wallet)
    .map(Address.isWatchOnly).getOrElse(false)
  let isUncompressedWatchOnly = Wallet.getAddress(c.address, wallet)
    .map(Address.isWatchOnly).getOrElse(false)

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

// /////////////////////////////////////////////////////////////////////////////
// To
export const TO = {
  ACCOUNT: 'TO.ACCOUNT',
  ADDRESS: 'TO.ADDRESS'
}

// toOutputAddress :: String -> Object
export const toOutputAddress = address =>
  ({ type: TO.ADDRESS, address })

// toOutputAccount :: String -> Integer -> Integer -> Object
export const toOutputAccount = (address, accountIndex, addressIndex) =>
  ({type: TO.ACCOUNT, address, accountIndex, addressIndex})

// toOutputAccount :: Network -> ReduxState -> String|Integer -> Object
export const toOutput = curry((network, state, addressOrIndex) => {
  let wallet = S.wallet.getWallet(state)
  if (isPositiveInteger(addressOrIndex)) {
    let account = Wallet.getAccount(addressOrIndex, wallet).get() // throw if nothing
    let receiveIndex = S.data.bitcoin.getReceiveIndex(account.xpub, state)
      .getOrFail(new Error('missing_receive_address'))
    let address = HDAccount.getReceiveAddress(account, receiveIndex, network)
    return toOutputAccount(address, addressOrIndex, receiveIndex)
  } else {
    return toOutputAddress(addressOrIndex)
  }
})

// /////////////////////////////////////////////////////////////////////////////
// prepare Unspent Coins
export const toCoin = curry((network, fromData, input) => {
  switch (fromData.fromType) {
    case FROM.ACCOUNT:
      let path = input.xpub ? `${fromData.fromAccountIdx}${drop(1, input.xpub.path)}` : undefined
      return Coin.fromJS(assoc('path', path, input), network)
    case FROM.LEGACY:
      return Coin.fromJS(input, network)
    case FROM.WATCH_ONLY:
      return Coin.fromJS(assoc('priv', fromData.wifKeys[0], input), network)
    case FROM.EXTERNAL:
      let coin = Coin.fromJS(input, network)
      let address = Coin.selectAddress(coin)
      return set(Coin.priv, fromData.wifKeys[address], coin)
    default:
      throw new Error('fromType_not_recognized')
  }
})
