import { errorHandler } from 'blockchain-wallet-v4/src/utils'
import { SwapQuoteType } from 'core/types'
import BigNumber from 'bignumber.js'

export const getRate = (
  priceTiers: SwapQuoteType['quote']['priceTiers'],
  amount: BigNumber
): number => {
  try {
    for (var index = 0; index <= priceTiers.length; index++) {
      const priceTier = priceTiers[index]
      if (index === priceTiers.length - 1) return Number(priceTier.price)

      const nextTier = priceTiers[index + 1]
      const thisVol = new BigNumber(priceTier.volume)
      const nextVol = new BigNumber(nextTier.volume)

      if (thisVol.isLessThan(amount) && amount.isLessThanOrEqualTo(nextVol)) {
        const price = interpolatePrice(
          [new BigNumber(priceTier.volume), new BigNumber(nextTier.volume)],
          [new BigNumber(priceTier.price), new BigNumber(nextTier.price)],
          amount
        )

        if (typeof price === 'string') throw price
        return price
      }
    }

    return 0
  } catch (e) {
    return errorHandler(e) as any
  }
}

// From Android:
// class LinearInterpolator : Interpolator {
//   override fun interpolate(x: List<BigDecimal>, y: List<BigDecimal>, xi: BigDecimal): BigDecimal {
//       require(x.size == y.size) { "Should be same size" }
//       require(x.size == 2) { "Should contain two points" }
//       require(x.zipWithNext().all { it.first <= it.second }) { "$x Should be sorted" }
//       require(xi >= x[0] && xi <= x[1]) { "$xi Should be between ${x[0]} and ${x[1]}" }
//       return (((xi - x[0]) * (y[1] - y[0])).divide(x[1] - x[0])) + y[0]
//       // Formula：Y = ( ( X - X1 )( Y2 - Y1) / ( X2 - X1) ) + Y1
//       // X1, Y1 = first value, X2, Y2 = second value, X = target value, Y = result
//   }
// }
export const interpolatePrice = (
  x: [BigNumber, BigNumber],
  y: [BigNumber, BigNumber],
  xi: BigNumber
): number | string => {
  try {
    if (x.length !== y.length) throw new Error('Should be same size')
    if (x.length !== 2) throw new Error('Should contain two points')
    if (x[0].isGreaterThan(x[1])) throw new Error('Should be sorted')
    if (xi.isLessThan(x[0]) && xi.isGreaterThan(x[1]))
      throw new Error('Amount should be between x[0] and x[1]')

    return xi
      .minus(x[0])
      .times(y[1].minus(y[0]).dividedBy(x[1].minus(x[0])))
      .plus(y[0])
      .toNumber()
  } catch (e) {
    return errorHandler(e)
  }
}
