import { selectors } from 'data'

export const getData = (state) => {
  return {
    value: selectors.core.kvStore.ethereum.getContext(state)
  }
}
