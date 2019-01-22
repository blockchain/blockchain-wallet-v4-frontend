import * as bch from './bch/actions'
import * as btc from './btc/actions'
import * as bsv from './bsv/actions'
import * as coinify from './coinify/actions'
import * as eth from './eth/actions'
import * as misc from './misc/actions'
import * as sfox from './sfox/actions'
import * as shapeShift from './shapeShift/actions'
import * as xlm from './xlm/actions'

// TODO: rename exports as coin codes
export {
  bch,
  btc as bitcoin,
  bsv,
  coinify,
  eth as ethereum,
  misc,
  sfox,
  shapeShift,
  xlm
}
