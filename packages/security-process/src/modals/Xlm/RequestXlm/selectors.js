import { selectors } from 'data'
import { head, lift, nth, prop, propOr } from 'ramda'
import { utils } from 'blockchain-wallet-v4'
import { formValueSelector } from 'redux-form'

const extractAddress = account => prop('publicKey', head(account))

export const getData = state => {
  const to = formValueSelector('requestXlm')(state, 'to')
  const accountsR = selectors.core.kvStore.xlm.getAccounts(state)
  const availability = selectors.core.walletOptions.getCoinAvailability(
    state,
    'XLM'
  )
  const excludeLockbox = !availability
    .map(propOr(true, 'lockbox'))
    .getOrElse(true)
  const transform = accounts => {
    const address = to ? prop('address', to) : extractAddress(accounts)
    return {
      address,
      excludeLockbox,
      type: prop('type', to),
      xlmURI: utils.xlm.encodeXlmURI(address)
    }
  }

  return lift(transform)(accountsR)
}

export const getInitialValues = (state, ownProps) => {
  const to = to => ({ to, coin: 'XLM' })
  if (ownProps.lockboxIndex != null) {
    return selectors.core.common.xlm
      .getLockboxXlmBalances(state)
      .map(nth(ownProps.lockboxIndex))
      .map(to)
      .getOrFail()
  }
  return selectors.core.common.xlm
    .getAccountBalances(state)
    .map(head)
    .map(to)
    .getOrFail()
}
