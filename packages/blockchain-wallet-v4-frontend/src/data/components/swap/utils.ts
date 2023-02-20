import BigNumber from 'bignumber.js'

import {
  CoinType,
  SwapOrderDirectionEnum,
  SwapPaymentMethod,
  SwapProfile,
  SwapQuoteType
} from '@core/types'
import { errorHandler } from '@core/utils'
import { notReachable } from 'utils/helpers'

import { convertBaseToStandard } from '../exchange/services'
import { SwapAccountType, SwapBaseCounterTypes } from './types'

export const getDirection = (
  BASE: SwapAccountType,
  COUNTER: SwapAccountType
): SwapOrderDirectionEnum => {
  switch (true) {
    case BASE.type === SwapBaseCounterTypes.CUSTODIAL &&
      COUNTER.type === SwapBaseCounterTypes.CUSTODIAL:
      return SwapOrderDirectionEnum.INTERNAL
    case BASE.type === SwapBaseCounterTypes.ACCOUNT &&
      COUNTER.type === SwapBaseCounterTypes.ACCOUNT:
      return SwapOrderDirectionEnum.ON_CHAIN
    case BASE.type === SwapBaseCounterTypes.ACCOUNT &&
      COUNTER.type === SwapBaseCounterTypes.CUSTODIAL:
      return SwapOrderDirectionEnum.FROM_USERKEY
    case BASE.type === SwapBaseCounterTypes.CUSTODIAL &&
      COUNTER.type === SwapBaseCounterTypes.ACCOUNT:
      return SwapOrderDirectionEnum.TO_USERKEY
    default:
      return SwapOrderDirectionEnum.INTERNAL
  }
}

export const getProfile = (BASE: SwapAccountType, COUNTER: SwapAccountType): SwapProfile => {
  switch (true) {
    case BASE.type === SwapBaseCounterTypes.CUSTODIAL &&
      COUNTER.type === SwapBaseCounterTypes.CUSTODIAL:
      return SwapProfile.SWAP_INTERNAL
    case BASE.type === SwapBaseCounterTypes.ACCOUNT &&
      COUNTER.type === SwapBaseCounterTypes.ACCOUNT:
      return SwapProfile.SWAP_ON_CHAIN
    case BASE.type === SwapBaseCounterTypes.ACCOUNT &&
      COUNTER.type === SwapBaseCounterTypes.CUSTODIAL:
      return SwapProfile.SWAP_FROM_USERKEY
    case BASE.type === SwapBaseCounterTypes.CUSTODIAL &&
      COUNTER.type === SwapBaseCounterTypes.ACCOUNT:
      return SwapProfile.SWAP_TO_USERKEY
    default:
      return SwapProfile.SWAP_INTERNAL
  }
}

export const getPaymentMethod = (profile: SwapProfile): SwapPaymentMethod => {
  switch (profile) {
    case SwapProfile.SWAP_ON_CHAIN:
    case SwapProfile.SWAP_FROM_USERKEY:
    case SwapProfile.SWAP_TO_USERKEY:
      return SwapPaymentMethod.Deposit
    case SwapProfile.SWAP_INTERNAL:
      return SwapPaymentMethod.Funds
    default:
      return notReachable(profile)
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

export const isValidInputAmount = (amount?: string): amount is string => {
  if (amount === undefined) {
    return false
  }

  const parsedAmount = parseFloat(amount)

  if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
    return false
  }

  return true
}
