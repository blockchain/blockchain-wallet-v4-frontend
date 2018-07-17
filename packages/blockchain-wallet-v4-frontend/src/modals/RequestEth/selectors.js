import { selectors } from 'data'
import { head, prop } from 'ramda'

const extractAddress = addr => prop('addr', head(addr))

export const getData = state =>
  selectors.core.kvStore.ethereum.getAccounts(state).map(extractAddress)
