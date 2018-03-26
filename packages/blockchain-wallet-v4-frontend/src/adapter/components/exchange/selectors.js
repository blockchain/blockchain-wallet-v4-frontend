import { concat, lift, path } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'

export const getStep = path(['adapter', 'components', 'exchange', 'step'])

export const getLoading = path(['adapter', 'components', 'exchange', 'loading'])

export const getError = path(['adapter', 'components', 'exchange', 'error'])
