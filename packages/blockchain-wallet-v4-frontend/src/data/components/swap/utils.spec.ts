import BigNumber from 'bignumber.js'

import { interpolatePrice } from './utils'

// https://github.com/blockchain/service-trading-backend/blob/master/client-quote/src/test/kotlin/info/blockchain/albert/client/interpolate/LinearInterpolationTest.kt

// assertEquals(7.5, interpolator.interpolate(50.0, 5.0, 100.0, 10.0, 75.0), 0.0)

describe('interpolatePrice', () => {
  it('should calculate price correctly', () => {
    const simpleTest = interpolatePrice(
      new BigNumber(50),
      new BigNumber(5),
      new BigNumber(100),
      new BigNumber(10),
      new BigNumber(75)
    )
    const sameQty1 = interpolatePrice(
      new BigNumber(50),
      new BigNumber(5),
      new BigNumber(100),
      new BigNumber(10),
      new BigNumber(50)
    )
    const sameQty2 = interpolatePrice(
      new BigNumber(50),
      new BigNumber(5),
      new BigNumber(100),
      new BigNumber(10),
      new BigNumber(100)
    )
    const noQty1 = interpolatePrice(
      new BigNumber(0),
      new BigNumber(0),
      new BigNumber(100),
      new BigNumber(10),
      new BigNumber(50)
    )
    expect(simpleTest).toEqual(7.5)
    expect(sameQty1).toEqual(5)
    expect(sameQty2).toEqual(10)
    expect(noQty1).toEqual(5)
  })
})
