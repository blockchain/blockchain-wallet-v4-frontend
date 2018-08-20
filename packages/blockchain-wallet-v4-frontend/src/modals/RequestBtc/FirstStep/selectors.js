import { formValueSelector } from 'redux-form'
import { equals, head, lift, filter, map, prop } from 'ramda'
import { selectors } from 'data'
import { Remote } from 'blockchain-wallet-v4/src'
import Bitcoin from 'bitcoinjs-lib'

// extractAddress :: (Int -> Remote(String)) -> Int -> Remote(String)
const extractAddress = (selectorFunction, value) =>
  value
    ? value.address
      ? Remote.of(value.address)
      : selectorFunction(value.index)
    : Remote.NotAsked

const extractAddressIdx = (selectorFunction, value) =>
  value
    ? value.address
      ? Remote.of(value.address)
      : selectorFunction(value.index)
    : Remote.NotAsked

const extractAccountIdx = value =>
  value
    ? value.address
      ? Remote.of(value.address)
      : Remote.of(value.index)
    : Remote.NotAsked

export const getData = state => {
  const networkR = selectors.core.walletOptions.getBtcNetwork(state)
  const network = networkR.getOrElse('bitcoin')

  const getReceive = index =>
    selectors.core.common.btc.getNextAvailableReceiveAddress(
      Bitcoin.networks[network],
      index,
      state
    )
  const getReceiveIdx = index =>
    selectors.core.common.btc.getNextAvailableReceiveIndex(
      Bitcoin.networks[network],
      index,
      state
    )
  const message = formValueSelector('requestBitcoin')(state, 'message')
  const amount = formValueSelector('requestBitcoin')(state, 'amount')
  const coin = formValueSelector('requestBitcoin')(state, 'coin')
  const to = formValueSelector('requestBitcoin')(state, 'to')
  const accountIdxR = extractAccountIdx(to)
  const receiveAddressR = extractAddress(getReceive, to)
  const receiveAddressIdxR = extractAddressIdx(getReceiveIdx, to)
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
