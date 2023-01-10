import deepEqual from 'fast-deep-equal'
import { createSelectorCreator, defaultMemoize } from 'reselect'

import * as bch from './bch'
import * as btc from './btc'
import * as checks from './checks'
import * as eth from './eth'
import * as xlm from './xlm'

const createDeepEqualSelector = createSelectorCreator(defaultMemoize, deepEqual)

enum Coin {
  CRYPTO = 'CRYPTO',
  FIAT = 'FIAT'
}

const MISSING_WALLET = 'MISSING_WALLET'

const errorHandler = (e): string => {
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

const errorHandlerCode = (e) => {
  return typeof e === 'object' && e.code ? e.code : errorHandler(e)
}

const errorCodeAndMessage = (e) => ({
  code: typeof e === 'object' ? Number(e.code) : 1,
  message: errorHandler(e)
})

export {
  bch,
  btc,
  checks,
  Coin,
  createDeepEqualSelector,
  errorCodeAndMessage,
  errorHandler,
  errorHandlerCode,
  eth,
  MISSING_WALLET,
  xlm
}
