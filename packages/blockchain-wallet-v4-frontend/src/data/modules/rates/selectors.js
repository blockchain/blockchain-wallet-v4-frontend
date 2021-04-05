import {
  compose,
  curry,
  lift,
  mapObjIndexed,
  path,
  prop,
  propOr,
  values
} from 'ramda'

import { Remote } from 'blockchain-wallet-v4/src'

export const getActivePairs = compose(
  values,
  mapObjIndexed((pair, pairName) => ({ ...pair, pair: pairName })),
  path(['rates', 'pairs'])
)

const getPair = curry((pair, state) => path(['rates', 'pairs', pair], state))

export const getPairQuote = curry(
  compose(propOr(Remote.NotAsked, 'quote'), getPair)
)

export const getPairAdvice = curry(
  compose(lift(prop('currencyRatio')), getPairQuote)
)
export const getPairConfig = curry(compose(prop('config'), getPair))
export const getPairFix = curry(compose(prop('fix'), getPairConfig))

export const getBestRates = path(['rates', 'bestRates'])
export const getBestRate = curry((pair, state) =>
  getBestRates(state).map(prop(pair))
)

export const getAvailablePairs = path(['rates', 'availablePairs'])
