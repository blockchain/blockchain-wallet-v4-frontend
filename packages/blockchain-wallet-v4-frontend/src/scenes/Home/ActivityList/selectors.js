import { RemoteData } from 'blockchain-wallet-v4/src'
import { take } from 'ramda'
import { selectors } from 'data'

export const getData = (state, number) => ({
  value: RemoteData.map(x => take(8, x), selectors.core.data.misc.getLogs(state))
})
