import { errorHandler } from 'blockchain-wallet-v4/src/utils'
import { SwapQuoteType } from 'core/types'
import BigNumber from 'bignumber.js'

export const getRate = (
  priceTiers: SwapQuoteType['quote']['priceTiers'],
  amount: BigNumber
) => {
  try {
    for (var index = 0; index <= priceTiers.length; index++) {
      const priceTier = priceTiers[index]
      const nextTier = priceTiers[index + 1]
      const thisVol = new BigNumber(priceTier.volume)
      const nextVol = new BigNumber(nextTier.volume)

      if (thisVol.isLessThan(amount) && amount.isLessThanOrEqualTo(nextVol)) {
        return interpolatePrice(
          [priceTier.volume, nextTier.volume],
          [priceTier.price, nextTier.volume],
          amount
        )
      }
    }

    return 0
  } catch (e) {
    return e
  }
}

const interpolatePrice = (
  x: [string, string],
  y: [string, string],
  xi: BigNumber
): string => {
  try {
    if (x.length !== y.length) throw new Error('Should be same size')
    if (x.length !== 2) throw new Error('Should contain two points')
    if (new BigNumber(x[0]).isGreaterThan(x[1]))
      throw new Error('Should be sorted')
    if (xi.isLessThan(x[0]) && xi.isGreaterThan(x[1]))
      throw new Error('Amount should be between x[0] and x[1]')

    return xi
      .minus(x[0])
      .times(new BigNumber(y[1]).minus(y[0]))
      .dividedBy(new BigNumber(x[1]).minus(x[0]))
      .plus(y[0])
      .toString()
  } catch (e) {
    return errorHandler(e)
  }
}
