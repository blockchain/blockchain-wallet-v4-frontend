import { equals } from 'ramda'
import { createSelectorCreator, defaultMemoize } from 'reselect'

import * as bch from './bch'
import * as btc from './btc'
import * as bsv from './bsv'
import * as ethereum from './eth'
import * as xlm from './xlm'
import * as checks from './checks'

const createDeepEqualSelector = createSelectorCreator(defaultMemoize, equals)

export { bch, btc, bsv, ethereum, xlm, checks, createDeepEqualSelector }
