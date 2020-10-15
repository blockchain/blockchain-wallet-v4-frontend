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
          new BigNumber(priceTier.volume),
          new BigNumber(priceTier.price),
          new BigNumber(nextTier.volume),
          new BigNumber(nextTier.price),
          amount
        )

        if (typeof price === 'string') throw price
        return price
      }
    }

    return 0
  } catch (e) {
    throw Error(errorHandler(e))
  }
}

export const interpolatePrice = (
  thisVol: BigNumber,
  thisPrice: BigNumber,
  nextVol: BigNumber,
  nextPrice: BigNumber,
  amount: BigNumber
): number | string => {
  try {
    if (thisPrice.isGreaterThan(nextPrice)) throw new Error('Should be sorted')
    if (thisVol.isGreaterThan(nextVol)) throw new Error('Should be sorted')
    if (amount.isLessThan(thisVol) && amount.isGreaterThan(nextVol))
      throw new Error('Amount should be between x[0] and x[1]')

    return amount
      .minus(thisVol)
      .times(nextPrice.minus(thisPrice).dividedBy(nextVol.minus(thisVol)))
      .plus(thisPrice)
      .toNumber()
  } catch (e) {
    return errorHandler(e)
  }
}
