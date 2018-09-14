import { curry, pathOr } from 'ramda'

import { Remote } from 'blockchain-wallet-v4'

export const getLimits = curry((currency, state) =>
  pathOr(Remote.NotAsked, ['limits', 'currencies', currency], state)
)
