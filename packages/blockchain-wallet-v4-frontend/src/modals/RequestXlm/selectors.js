import { selectors } from 'data'
import { head, prop } from 'ramda'

const extractAddress = account => prop('publicKey', head(account))

export const getData = state =>
  selectors.core.kvStore.xlm.getAccounts(state).map(extractAddress)

// export const getInitialValues = (state, ownProps) => {
//   const to = to => ({ to, coin: 'ETH' })
//   if (ownProps.lockboxIndex != null) {
//     return selectors.core.common.eth
//       .getLockboxEthBalances(state)
//       .map(nth(ownProps.lockboxIndex))
//       .map(to)
//       .getOrFail()
//   }
//   return selectors.core.common.eth
//     .getAccountBalances(state)
//     .map(head)
//     .map(to)
//     .getOrFail()
// }
