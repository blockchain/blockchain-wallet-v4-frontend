import { equals } from 'ramda'
import { createSelectorCreator, defaultMemoize } from 'reselect'

import * as bch from './bch'
import * as bitcoin from './btc'
import * as ethereum from './eth'
import * as xlm from './xlm'
import * as bigNumber from './bigNumber'
import * as checks from './checks'

const createDeepEqualSelector = createSelectorCreator(defaultMemoize, equals)

export {
  bch,
  bitcoin,
  ethereum,
  xlm,
  bigNumber,
  checks,
  createDeepEqualSelector
}
