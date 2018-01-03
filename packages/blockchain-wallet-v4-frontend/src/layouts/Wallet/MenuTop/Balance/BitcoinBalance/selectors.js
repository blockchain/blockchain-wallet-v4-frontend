import { selectors } from 'data'

export const getData = (state) => ({
  value: selectors.core.kvStore.ethereum.getMetadata(state)
})
