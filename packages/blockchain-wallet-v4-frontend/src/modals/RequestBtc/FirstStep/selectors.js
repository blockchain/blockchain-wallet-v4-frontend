import { formValueSelector } from 'redux-form'
import { equals, head, lift, filter, map, prop } from 'ramda'
import { selectors } from 'data'
import { Remote } from 'blockchain-wallet-v4/src'
import Bitcoin from 'bitcoinjs-lib'

const extractAddress = (walletSelector, lockboxSelector, value) =>
  value
    ? value.address
      ? Remote.of(value.address)
      : value.index !== undefined
        ? walletSelector(value.index)
        : lockboxSelector(value.xpub)
    : Remote.NotAsked

const extractAddressIdx = (walletSelector, lockboxSelector, value) =>
  value
    ? value.address
      ? Remote.of(value.address)
      : value.index !== undefined
        ? walletSelector(value.index)
        : lockboxSelector(value.xpub)
    : Remote.NotAsked

const extractAccountIdx = value =>
  value
    ? value.address
      ? Remote.of(value.address)
      : value.index !== undefined
        ? Remote.of(value.index)
        : Remote.of(value.xpub)
    : Remote.NotAsked

export const getData = state => {
  const networkR = selectors.core.walletOptions.getBtcNetwork(state)
  const network = networkR.getOrElse('bitcoin')

  const getReceiveAddressWallet = index =>
    selectors.core.common.btc.getNextAvailableReceiveAddress(
      Bitcoin.networks[network],
      index,
      state
    )
  const getReceiveIdxWallet = index =>
    selectors.core.common.btc.getNextAvailableReceiveIndex(
      Bitcoin.networks[network],
      index,
      state
    )
  const getReceiveAddressLockbox = xpub =>
    selectors.core.common.btc.getNextAvailableReceiveAddressLockbox(
      Bitcoin.networks[network],
      xpub,
      state
    )
  const getReceiveIdxLockbox = xpub =>
    selectors.core.common.btc.getNextAvailableReceiveIndexLockbox(
      Bitcoin.networks[network],
      xpub,
      state
    )

  const message = formValueSelector('requestBitcoin')(state, 'message')
  const amount = formValueSelector('requestBitcoin')(state, 'amount')
  const coin = formValueSelector('requestBitcoin')(state, 'coin')
  const to = formValueSelector('requestBitcoin')(state, 'to')
  const accountIdxR = extractAccountIdx(to)
  const receiveAddressIdxR = extractAddressIdx(
    getReceiveIdxWallet,
    getReceiveIdxLockbox,
    to
  )
  const receiveAddressR = extractAddress(
    getReceiveAddressWallet,
    getReceiveAddressLockbox,
    to
  )

  const transform = (receiveAddress, accountIdx, addressIdx) => ({
    coin,
    receiveAddress,
    amount,
    message,
    accountIdx,
    addressIdx
  })
  return lift(transform)(receiveAddressR, accountIdxR, receiveAddressIdxR)
}

export const getInitialValues = state => {
  const toDropdown = map(x => ({ text: x.label, value: x }))
  const balancesR = selectors.core.common.btc
    .getAccountsBalances(state)
    .map(toDropdown)
  const xpub = selectors.core.wallet.getDefaultAccountXpub(state)
  const defaultElementR = balancesR.map(x =>
    prop('value', head(filter(y => equals(y.value.xpub, xpub), x)))
  )
  return defaultElementR.map(to => ({ to, coin: 'BTC' }))
}

export const getImportedAddresses = state => {
  const balances = selectors.core.common.btc.getAddressesBalances(state)
  const isWatchOnly = a => {
    if (equals(prop('watchOnly', a), true)) return prop('address', a)
  }
  return map(isWatchOnly, balances.getOrElse([]))
}
