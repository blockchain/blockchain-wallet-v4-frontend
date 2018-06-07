import { formValueSelector } from 'redux-form'
import { equals, head, lift, filter, map, prop } from 'ramda'
import settings from 'config'
import { selectors } from 'data'
import { Remote } from 'blockchain-wallet-v4/src'

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

const extractAccountIdx = (value) =>
  value
    ? value.address
      ? Remote.of(value.address)
      : Remote.of(value.index)
    : Remote.NotAsked

export const getData = state => {
  const getReceive = index => selectors.core.common.btc.getNextAvailableReceiveAddress(settings.NETWORK_BITCOIN, index, state)
  const getReceiveIdx = index => selectors.core.common.btc.getNextAvailableReceiveIndex(settings.NETWORK_BITCOIN, index, state)
  const message = formValueSelector('requestBitcoin')(state, 'message')
  const amount = formValueSelector('requestBitcoin')(state, 'amount')
  const coin = formValueSelector('requestBitcoin')(state, 'coin')
  const to = formValueSelector('requestBitcoin')(state, 'to')
  const accountIdxR = extractAccountIdx(to)
  const receiveAddressR = extractAddress(getReceive, to)
  const receiveAddressIdxR = extractAddressIdx(getReceiveIdx, to)
  const transform = (receiveAddress, accountIdx, addressIdx) => ({ coin, receiveAddress, amount, message, accountIdx, addressIdx })
  return lift(transform)(receiveAddressR, accountIdxR, receiveAddressIdxR)
}

export const getInitialValues = state => {
  const toDropdown = map(x => ({ text: x.label, value: x }))
  const balancesR = selectors.core.common.btc.getAccountsBalances(state).map(toDropdown)
  const xpub = selectors.core.wallet.getDefaultAccountXpub(state)
  const defaultElementR = balancesR.map(x => prop('value', head(filter(y => equals(y.value.xpub, xpub), x))))
  return defaultElementR.map(to => ({to, coin: 'BTC'}))
}
