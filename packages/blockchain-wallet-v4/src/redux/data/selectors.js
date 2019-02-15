import * as bch from './bch/selectors'
import * as btc from './btc/selectors'
import * as bsv from './bsv/selectors'
import * as coinify from './coinify/selectors'
import * as eth from './eth/selectors'
import * as misc from './misc/selectors'
import * as sfox from './sfox/selectors'
import * as shapeShift from './shapeShift/selectors'
import * as xlm from './xlm/selectors'

// TODO: rename exports as coin codes
export {
  bch,
  btc as bitcoin,
  bsv,
  coinify,
  eth as ethereum,
  xlm,
  misc,
  sfox,
  shapeShift
}
