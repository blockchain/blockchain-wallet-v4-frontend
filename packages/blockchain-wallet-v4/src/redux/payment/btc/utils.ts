import { always, assoc, compose, converge, curry, drop, or, prop, propEq, set } from 'ramda'

import * as Coin from '../../../coinSelection/coin'
import { Address, HDAccount, Wallet } from '../../../types'
import { getWifAddress, isValidBtcAddress } from '../../../utils/btc'
import * as S from '../../selectors'

// /////////////////////////////////////////////////////////////////////////////
// Validations
// isValidIndex :: Wallet -> Integer -> Boolean
export const isValidIndex = curry((wallet, index) =>
  Wallet.getAccount(index, wallet).map(always(true)).getOrElse(false)
)

// isValidAddressOrIndex :: Wallet -> Any -> Boolean
export const isValidAddressOrIndex = curry((wallet, candidate) =>
  converge(or, [isValidBtcAddress, isValidIndex(wallet)])(candidate)
)

// /////////////////////////////////////////////////////////////////////////////
// From
export const ADDRESS_TYPES = {
  ACCOUNT: 'ACCOUNT',
  ADDRESS: 'ADDRESS',
  CUSTODIAL: 'CUSTODIAL',
  EXTERNAL: 'EXTERNAL',
  INTEREST: 'INTEREST',
  LEGACY: 'LEGACY', // Imported Addresses
  SCRIPT: 'SCRIPT',
  STAKING: 'STAKING',
  WATCH_ONLY: 'WATCH_ONLY'
}

// fromLegacy :: String -> Object
export const fromLegacy = (address) => ({
  change: address,
  from: [address],
  fromType: ADDRESS_TYPES.LEGACY
})

// fromLegacyList :: [String] -> Object
export const fromLegacyList = (addresses) => ({
  change: addresses[0],
  from: addresses,
  fromType: ADDRESS_TYPES.LEGACY
})

// fromWatchOnly :: String -> String -> Object
export const fromWatchOnly = (address, wif) => ({
  change: address,
  from: [address],
  fromType: ADDRESS_TYPES.WATCH_ONLY,
  wifKeys: [wif]
})

// fromExternal :: String -> String -> String -> String -> Object
export const fromExternal = (addrComp, addrUncomp, wifComp, wifUncomp) => ({
  change: addrComp,
  from: [addrComp, addrUncomp],
  fromType: ADDRESS_TYPES.EXTERNAL,
  wifKeys: compose(assoc(addrComp, wifComp), assoc(addrUncomp, wifUncomp))({})
})

// fromAccount :: Network -> ReduxState -> Object
export const fromAccount = (network, state, index) => {
  const wallet = S.wallet.getWallet(state)
  const account = Wallet.getAccount(index, wallet).get()
  const defaultDerivationXpub = HDAccount.selectXpub(account)
  const allXpubsGrouped = HDAccount.selectAllXpubsGrouped(account).toJS()
  const legacy = prop('xpub', allXpubsGrouped.find(propEq('type', 'legacy')))
  const bech32 = prop('xpub', allXpubsGrouped.find(propEq('type', 'bech32')))

  const receiveIndex = S.data.btc.getReceiveIndex(defaultDerivationXpub, state)
  const changeIndex = S.data.btc.getChangeIndex(defaultDerivationXpub, state)
  let changeAddress = changeIndex
    .map((index) => HDAccount.getChangeAddress(account, index, network))
    .getOrFail('missing_change_address')
  // When moving from one chain to another i.e legacy to segwit
  // we must send to the receive chain so that backend services
  // will search for funds on the change chain. Without funds
  // received to a receive chain, the backend will not lookup change.
  const shouldTransferToReceive = receiveIndex.getOrElse(0) === 0
  const receiveAddress = shouldTransferToReceive
    ? HDAccount.getReceiveAddress(account, 0, network)
    : ''

  if (shouldTransferToReceive && receiveAddress) {
    changeAddress = receiveAddress
  }

  return {
    change: changeAddress,
    extras: {
      bech32
    },
    from: [legacy],
    fromAccountIdx: index,
    fromType: ADDRESS_TYPES.ACCOUNT
  }
}

export const fromCustodial = (origin) => {
  return {
    from: origin,
    fromType: ADDRESS_TYPES.CUSTODIAL
  }
}

// fromPrivateKey :: Network -> Wallet -> ECKey -> Object
export const fromPrivateKey = (network, wallet, key) => {
  const c = getWifAddress(key, true)
  const u = getWifAddress(key, false)
  // TODO: SEGWIT i believe we can get rid of the watch only checks
  const isCompressedWatchOnly = Wallet.getAddress(c.address, wallet)
    .map(Address.isWatchOnly)
    .getOrElse(false)
  const isUncompressedWatchOnly = Wallet.getAddress(u.address, wallet)
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
  const xpub =
    coin === 'BTC' ? HDAccount.selectXpub(account) : HDAccount.selectXpub(account, 'legacy')
  const receiveIndexR =
    coin === 'BTC'
      ? S.data.btc.getReceiveIndex(xpub, state)
      : S.data.bch.getReceiveIndex(xpub, state)
  const receiveIndex = receiveIndexR.getOrFail(new Error('missing_receive_address'))
  const address =
    coin === 'BTC'
      ? HDAccount.getReceiveAddress(account, receiveIndex, network)
      : HDAccount.getReceiveAddress(account, receiveIndex, network, 'legacy')
  return {
    accountIndex,
    address,
    addressIndex: receiveIndex,
    type: ADDRESS_TYPES.ACCOUNT
  }
}

// toOutputScript :: String -> Object
export const toOutputScript = (script) => ({
  script,
  type: ADDRESS_TYPES.SCRIPT
})

// toOutputCustodial :: String -> Object
export const toOutputCustodial = (address) => ({
  address,
  type: ADDRESS_TYPES.CUSTODIAL
})

// toOutputAddress :: String -> Object
export const toOutputAddress = (address) => ({
  address,
  type: ADDRESS_TYPES.ADDRESS
})

// toOutputAccount :: Network -> ReduxState -> String|Integer -> String -> Object
export const toOutput = curry((coin, network, state, destination, type) => {
  switch (type) {
    case ADDRESS_TYPES.ACCOUNT:
      return toOutputAccount(coin, network, state, destination)
    case ADDRESS_TYPES.SCRIPT: {
      return toOutputScript(destination)
    }
    case ADDRESS_TYPES.CUSTODIAL: {
      return toOutputCustodial(destination)
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
      const path = input.xpub ? `${fromData.fromAccountIdx}${drop(1, input.xpub.path)}` : undefined
      return Coin.fromJS(assoc('path', path, input), network)
    case ADDRESS_TYPES.LEGACY:
      return Coin.fromJS(input, network)
    case ADDRESS_TYPES.WATCH_ONLY:
      return Coin.fromJS(assoc('priv', fromData.wifKeys[0], input), network)
    case ADDRESS_TYPES.EXTERNAL:
      const coin = Coin.fromJS(input, network)
      const address = Coin.selectAddress(coin)
      return set(Coin.priv, fromData.wifKeys[address], coin)
    default:
      throw new Error('fromType_not_recognized')
  }
})
