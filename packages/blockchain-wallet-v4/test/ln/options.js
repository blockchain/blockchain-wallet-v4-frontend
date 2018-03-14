import {wrapHex} from '../../src/ln/helper'
const Long = require('long')

export const options = {
  chainHash: wrapHex('000000000933ea01ad0ee984209779baaec3ced90fa3f408719526f8d77f4943').reverse(),
  dustLimitSatoshis: 546,
  maxHtlcValueInFlightMsat: 100000,
  channelReserveSatoshis: 1000,
  feeRatePerKw: 10000,
  htlcMinimumMsat: 1,
  toSelfDelay: 60,
  maxAcceptedHtlcs: 100,
  minimumDepth: 5
}
