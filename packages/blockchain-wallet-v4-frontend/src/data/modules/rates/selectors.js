import { compose, curry, values, path, prop, mapObjIndexed } from 'ramda'

export const getActivePairs = compose(
  values,
  mapObjIndexed((pair, pairName) => ({ ...pair, pair: pairName })),
  path(['rates', 'pairs'])
)

const getPair = curry((pair, state) => path(['rates', 'pairs', pair], state))

export const getPairRate = curry(
  compose(
    prop('advice'),
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
