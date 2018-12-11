import { selectors } from 'data'
import { head, lift, prop, propOr, nth } from 'ramda'
import { formValueSelector } from 'redux-form'

const extractAddress = addr => prop('addr', head(addr))

export const getData = state => {
  const to = formValueSelector('requestEth')(state, 'to')
  const accountsR = selectors.core.kvStore.ethereum.getAccounts(state)
  const availability = selectors.core.walletOptions.getCoinAvailability(
    state,
    'ETH'
  )
  const excludeLockbox = !availability
    .map(propOr(true, 'lockbox'))
    .getOrElse(true)

  const transform = accounts => ({
    type: prop('type', to),
    address: to ? prop('address', to) : extractAddress(accounts),
    excludeLockbox
  })

  return lift(transform)(accountsR)
}

export const getInitialValues = (state, ownProps) => {
  const to = to => ({ to, coin: 'ETH' })
  if (ownProps.lockboxIndex != null) {
    return selectors.core.common.eth
      .getLockboxEthBalances(state)
      .map(nth(ownProps.lockboxIndex))
      .map(to)
      .getOrFail()
  }
  return selectors.core.common.eth
    .getAccountBalances(state)
    .map(head)
    .map(to)
    .getOrFail()
}
