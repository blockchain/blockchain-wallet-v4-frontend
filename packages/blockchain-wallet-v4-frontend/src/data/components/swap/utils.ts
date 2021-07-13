import BigNumber from 'bignumber.js'

import { CoinType, SwapOrderDirectionType, SwapQuoteType } from 'blockchain-wallet-v4/src/types'
import { errorHandler } from 'blockchain-wallet-v4/src/utils'

import { convertBaseToStandard } from '../exchange/services'
import { SwapAccountType, SwapBaseCounterTypes } from './types'

export const NO_QUOTE = 'No quote found.'

export const getDirection = (
  BASE: SwapAccountType,
  COUNTER: SwapAccountType
): SwapOrderDirectionType => {
  switch (true) {
    case BASE.type === SwapBaseCounterTypes.CUSTODIAL &&
      COUNTER.type === SwapBaseCounterTypes.CUSTODIAL:
      return 'INTERNAL'
    case BASE.type === SwapBaseCounterTypes.ACCOUNT &&
      COUNTER.type === SwapBaseCounterTypes.ACCOUNT:
      return 'ON_CHAIN'
    case BASE.type === SwapBaseCounterTypes.ACCOUNT &&
      COUNTER.type === SwapBaseCounterTypes.CUSTODIAL:
      return 'FROM_USERKEY'
    case BASE.type === SwapBaseCounterTypes.CUSTODIAL &&
      COUNTER.type === SwapBaseCounterTypes.ACCOUNT:
      return 'TO_USERKEY'
    default:
      return 'INTERNAL'
  }
}

export const getPair = (BASE: SwapAccountType, COUNTER: SwapAccountType) => {
  return `${BASE.coin}-${COUNTER.coin}`
}

export const interpolatePrice = (
  thisVol: BigNumber,
  thisPrice: BigNumber,
  nextVol: BigNumber,
  nextPrice: BigNumber,
  amount: BigNumber
): number | string => {
  try {
    return amount
      .minus(thisVol)
      .times(nextPrice.minus(thisPrice).dividedBy(nextVol.minus(thisVol)))
      .plus(thisPrice)
      .toNumber()
  } catch (e) {
    return errorHandler(e)
  }
}

export const getRate = (
  priceTiers: SwapQuoteType['quote']['priceTiers'],
  coin: CoinType,
  amount: BigNumber,
  minor?: boolean
): number => {
  try {
    for (let index = 0; index <= priceTiers.length; index += 1) {
      const priceTier = priceTiers[index]
      if (index === priceTiers.length - 1)
        return minor
          ? Number(priceTier.price)
          : new BigNumber(convertBaseToStandard(coin, priceTier.price)).toNumber()

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

        return minor ? price : new BigNumber(convertBaseToStandard(coin, price)).toNumber()
      }
    }

    return 0
  } catch (e) {
    throw Error(errorHandler(e))
  }
}
