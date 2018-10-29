import { selectors } from 'data'
import { head, nth, prop } from 'ramda'
import { utils } from 'blockchain-wallet-v4'

const extractAddress = account => prop('publicKey', head(account))

export const getData = state => {
  const addressR = selectors.core.kvStore.xlm
    .getAccounts(state)
    .map(extractAddress)

  return addressR.map(address => ({
    address,
    xlmURI: utils.xlm.encodeXlmURI(address)
  }))
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
