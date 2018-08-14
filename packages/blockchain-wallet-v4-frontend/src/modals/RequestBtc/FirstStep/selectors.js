import { formValueSelector } from 'redux-form'
import { equals, head, lift, filter, map, prop } from 'ramda'
import settings from 'config'
import { selectors } from 'data'
import { Remote } from 'blockchain-wallet-v4/src'

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
  const getReceiveAddressWallet = index =>
    selectors.core.common.btc.getNextAvailableReceiveAddress(
      settings.NETWORK_BITCOIN,
      index,
      state
    )
  const getReceiveIdxSoftware = index =>
    selectors.core.common.btc.getNextAvailableReceiveIndex(
      settings.NETWORK_BITCOIN,
      index,
      state
    )
  const getReceiveAddressLockbox = xpub =>
    selectors.core.common.btc.getNextAvailableReceiveAddressLockbox(
      settings.NETWORK_BITCOIN,
      xpub,
      state
    )
  const getReceiveIdxLockbox = xpub =>
    selectors.core.common.btc.getNextAvailableReceiveIndexLockbox(
      settings.NETWORK_BITCOIN,
      xpub,
      state
    )

  const message = formValueSelector('requestBitcoin')(state, 'message')
  const amount = formValueSelector('requestBitcoin')(state, 'amount')
  const coin = formValueSelector('requestBitcoin')(state, 'coin')
  const to = formValueSelector('requestBitcoin')(state, 'to')
  const accountIdxR = extractAccountIdx(to)
  const receiveAddressIdxR = extractAddressIdx(
    getReceiveIdxSoftware,
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
