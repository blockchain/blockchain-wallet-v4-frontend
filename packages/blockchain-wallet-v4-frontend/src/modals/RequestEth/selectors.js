import { selectors } from 'data'
import { head, prop, nth } from 'ramda'
import { formValueSelector } from 'redux-form'
import { Remote } from 'blockchain-wallet-v4/src'

const extractAddress = addr => prop('addr', head(addr))

export const getData = state => {
  const to = formValueSelector('requestEther')(state, 'to')
  return (
    (to && Remote.of(prop('address', to))) ||
    selectors.core.kvStore.ethereum.getAccounts(state).map(extractAddress)
  )
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
