import { selectors } from 'data'

export const getData = state => {
  const ethereumBalances = selectors.core.common.ethereum.getAccountBalances(state)
  ethereumBalances.map(console.log)
  return ''
}
