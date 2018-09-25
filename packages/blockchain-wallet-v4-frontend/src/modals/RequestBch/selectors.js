import { formValueSelector } from 'redux-form'
import { lift, head, nth } from 'ramda'
import settings from 'config'
import { selectors } from 'data'
import { Remote, utils } from 'blockchain-wallet-v4/src'

const { isCashAddr, toCashAddr } = utils.bch

// extractAddress :: (Int -> Remote(String)) -> Int -> Remote(String)
const extractAddress = (walletSelector, lockboxSelector, value) => {
  return value
    ? value.address
      ? Remote.of(value.address)
      : value.index !== undefined
        ? walletSelector(value.index)
        : lockboxSelector(value.xpub)
    : Remote.Loading
}

export const getData = (state, ownProps) => {
  const getReceiveAddressWallet = index =>
    selectors.core.common.bch.getNextAvailableReceiveAddress(
      settings.NETWORK_BCH,
      index,
      state
    )
  const getReceiveAddressLockbox = index =>
    selectors.core.common.bch.getNextAvailableReceiveAddressLockbox(
      settings.NETWORK_BCH,
      index,
      state
    )
  const coin = formValueSelector('requestBch')(state, 'coin')
  const to = formValueSelector('requestBch')(state, 'to')

  const initialValuesR = getInitialValues(state, ownProps)
  const receiveAddressR = extractAddress(
    getReceiveAddressWallet,
    getReceiveAddressLockbox,
    to
  ).map(
    address =>
      address && isCashAddr(address) ? address : toCashAddr(address, true)
  )

  const transform = (receiveAddress, initialValues) => ({
    coin,
    receiveAddress,
    initialValues
  })
  return lift(transform)(receiveAddressR, initialValuesR)
}

export const getInitialValues = (state, ownProps) => {
  const to = to => ({ to, coin: 'BCH' })
  if (ownProps.lockboxIndex != null) {
    return selectors.core.common.bch
      .getLockboxBchBalances(state)
      .map(nth(ownProps.lockboxIndex))
      .map(to)
  }
  const balancesR = selectors.core.common.bch.getAccountsBalances(state)
  const defaultIndexR = selectors.core.kvStore.bch.getDefaultAccountIndex(state)
  const transform = (defaultIndex, balances) => {
    const defaultElement = head(balances.filter(x => x.index === defaultIndex))
    return to(defaultElement)
  }
  return lift(transform)(defaultIndexR)(balancesR)
}
