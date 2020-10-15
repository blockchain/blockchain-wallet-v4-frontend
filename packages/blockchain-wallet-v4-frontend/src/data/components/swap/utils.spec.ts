import { interpolatePrice } from './utils'
import BigNumber from 'bignumber.js'

// https://github.com/blockchain/service-trading-backend/blob/master/client-quote/src/test/kotlin/info/blockchain/albert/client/interpolate/LinearInterpolationTest.kt
// rate, // thisVol, thisPrice, nextVol, nextPrice, amount
// assertEquals(7.5, interpolator.interpolate(50.0, 5.0, 100.0, 10.0, 75.0), 0.0)

describe('interpolatePrice', () => {
  it('should calculate price correctly', () => {
    const price1 = interpolatePrice(
      [new BigNumber(50), new BigNumber(100)],
      [new BigNumber(5), new BigNumber(10)],
      new BigNumber(75)
    )
    expect(price1).toEqual(7.5)
  })
})
