import * as bch from './bch'
import * as btc from './btc'
import * as checks from './checks'
import * as eth from './eth'
import * as xlm from './xlm'
import { createSelectorCreator, defaultMemoize } from 'reselect'
import { equals } from 'ramda'

const createDeepEqualSelector = createSelectorCreator(defaultMemoize, equals)

export { bch, btc, eth, xlm, checks, createDeepEqualSelector }
