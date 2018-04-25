import { formValueSelector } from 'redux-form'
import { equals, head, filter, map, prop } from 'ramda'
import settings from 'config'
import { selectors } from 'data'
import { Remote, utils } from 'blockchain-wallet-v4/src'

// extractAddress :: (Int -> Remote(String)) -> Int -> Remote(String)
const extractAddress = (selectorFunction, value) =>
  value
    ? value.address
      ? Remote.of(value.address)
      : selectorFunction(value.index)
    : Remote.Loading

export const getData = state => {
  // TODO: USE BCH network
  const getReceive = index => selectors.core.common.bch.getNextAvailableReceiveAddress(settings.NETWORK_BCH, index, state)
  const coin = formValueSelector('requestBch')(state, 'coin')
  const to = formValueSelector('requestBch')(state, 'to')
  const receiveAddressR = extractAddress(getReceive, to).map(addr => addr && utils.bch.toCashAddr(addr, true))
  return receiveAddressR.map(receiveAddress => ({ coin, receiveAddress }))
}

export const getInitialValues = state => {
  const toDropdown = map(x => ({ text: x.label, value: x }))
  const balancesR = selectors.core.common.bch.getAccountsBalances(state).map(toDropdown)
  const xpub = selectors.core.wallet.getDefaultAccountXpub(state)
  const defaultElementR = balancesR.map(x => prop('value', head(filter(y => equals(y.value.xpub, xpub), x))))
  return defaultElementR.map(to => ({to, coin: 'BCH'}))
}
