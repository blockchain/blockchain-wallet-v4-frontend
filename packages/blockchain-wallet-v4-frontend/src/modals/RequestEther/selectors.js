import { selectors } from 'data'

export const getAddress = state => selectors.core.kvStore.ethereum.getAccounts(state)
