import { equals } from 'ramda'
import { createSelectorCreator, defaultMemoize } from 'reselect'

import * as bch from './bch'
import * as btc from './btc'
import * as checks from './checks'
import * as eth from './eth'
import * as xlm from './xlm'

const createDeepEqualSelector = createSelectorCreator(defaultMemoize, equals)

export { bch, btc, checks, createDeepEqualSelector, eth, xlm }

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
