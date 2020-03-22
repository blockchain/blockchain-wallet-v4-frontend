import * as bch from './bch'
import * as btc from './btc'
import * as checks from './checks'
import * as eth from './eth'
import * as xlm from './xlm'
import { createSelectorCreator, defaultMemoize } from 'reselect'
import { equals } from 'ramda'

const createDeepEqualSelector = createSelectorCreator(defaultMemoize, equals)

export { bch, btc, eth, xlm, checks, createDeepEqualSelector }

export const MISSING_WALLET = 'missing_wallet'

export const errorHandler = (e): string => {
  return typeof e === 'object'
    ? e.description
      ? e.description
      : e.message
      ? e.message
      : JSON.stringify(e)
    : typeof e === 'string'
    ? e
    : 'Unknown Error'
}
