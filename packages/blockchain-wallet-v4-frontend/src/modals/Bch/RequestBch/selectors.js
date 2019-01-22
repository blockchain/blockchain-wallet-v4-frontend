import { formValueSelector } from 'redux-form'
import { prop, propOr, lift, head, nth } from 'ramda'
import { selectors } from 'data'
import { Remote, utils } from 'blockchain-wallet-v4/src'
import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'
import BitcoinCash from 'bitcoinforksjs-lib'
const { fromCashAddr, isCashAddr, toCashAddr } = utils.bch

// extractAddress :: (Int -> Remote(String)) -> Int -> Remote(String)
const extractAddress = (walletSelector, lockboxSelector, value) => {
  return value
    ? value.address && value.type !== ADDRESS_TYPES.LOCKBOX
      ? Remote.of(value.address)
      : value.index !== undefined
      ? walletSelector(value.index)
      : lockboxSelector(value.xpub)
    : Remote.Loading
}

export const getData = (state, ownProps) => {
  const networkR = selectors.core.walletOptions.getBtcNetwork(state)
  const network = networkR.getOrElse('bitcoin')
  const availability = selectors.core.walletOptions.getCoinAvailability(
    state,
    'BCH'
  )
  const excludeLockbox = !availability
    .map(propOr(true, 'lockbox'))
    .getOrElse(true)
  const getReceiveAddressWallet = index =>
    selectors.core.common.bch.getNextAvailableReceiveAddress(
      BitcoinCash.networks[network],
      index,
      state
    )
  const getReceiveAddressLockbox = index =>
    selectors.core.common.bch.getNextAvailableReceiveAddressLockbox(
      BitcoinCash.networks[network],
      index,
      state
    )
  const coin = formValueSelector('requestBch')(state, 'coin')
  const to = formValueSelector('requestBch')(state, 'to')
  const type = prop('type', to)

  const initialValuesR = getInitialValues(state, ownProps)
  const receiveAddressR = extractAddress(
    getReceiveAddressWallet,
    getReceiveAddressLockbox,
    to
  ).map(address =>
    address && isCashAddr(address) ? address : toCashAddr(address, true)
  )

  const transform = (receiveAddress, initialValues) => ({
    type,
    coin,
    receiveAddress,
    initialValues,
    legacyAddress: fromCashAddr(receiveAddress),
    excludeLockbox
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
