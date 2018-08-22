import { compose, curry, values, path, mapObjIndexed } from 'ramda'

export const getActivePairs = compose(
  values,
  mapObjIndexed((pair, pairName) => ({ ...pair, pair: pairName })),
  path(['rates', 'pairs'])
)

export const getPairRate = curry((pair, state) =>
  path(['rates', 'pairs', pair, 'advice'], state)
)

export const getPairFix = curry((pair, state) =>
  path(['rates', 'pairs', pair, 'config', 'fix'], state)
)

export const getAvailablePairs = path(['rates', 'availablePairs'])
