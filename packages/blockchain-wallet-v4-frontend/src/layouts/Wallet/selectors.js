import { selectors } from 'data'
import { sequence } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'

export const getData = state => sequence(Remote.of, [
  selectors.core.kvStore.ethereum.getMetadata(state),
  selectors.core.kvStore.whatsNew.getMetadata(state)
])
