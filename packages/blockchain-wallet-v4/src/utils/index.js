import { equals } from 'ramda'
import { createSelectorCreator, defaultMemoize } from 'reselect'

import * as bch from './bch'
import * as btc from './btc'
import * as eth from './eth'
import * as xlm from './xlm'
import * as checks from './checks'

const createDeepEqualSelector = createSelectorCreator(defaultMemoize, equals)

export { bch, btc, eth, xlm, checks, createDeepEqualSelector }
