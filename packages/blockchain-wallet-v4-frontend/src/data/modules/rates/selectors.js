import {
  compose,
  curry,
  values,
  path,
  prop,
  propOr,
  mapObjIndexed
} from 'ramda'
import { Remote } from 'blockchain-wallet-v4'

export const getActivePairs = compose(
  values,
  mapObjIndexed((pair, pairName) => ({ ...pair, pair: pairName })),
  path(['rates', 'pairs'])
)

const getPair = curry((pair, state) => path(['rates', 'pairs', pair], state))

export const getPairAdvice = curry(
  compose(
    propOr(Remote.NotAsked, 'advice'),
    getPair
  )
)
export const getPairConfig = curry(
  compose(
    prop('config'),
    getPair
  )
)
export const getPairFix = curry(
  compose(
    prop('fix'),
    getPairConfig
  )
)

export const getAvailablePairs = path(['rates', 'availablePairs'])
