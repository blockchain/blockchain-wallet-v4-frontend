import BigNumber from 'bignumber.js'
import { addMilliseconds, addSeconds, differenceInMilliseconds } from 'date-fns'

import { SwapOrderDirection, SwapPaymentMethod, SwapProfile } from '@core/types'
import { errorHandler } from '@core/utils'
import { notReachable } from 'utils/helpers'

import { SwapAccountType, SwapBaseCounterTypes } from './types'

export const getDirection = (
  BASE: SwapAccountType,
  COUNTER: SwapAccountType
): SwapOrderDirection => {
  switch (true) {
    case BASE.type === SwapBaseCounterTypes.CUSTODIAL &&
      COUNTER.type === SwapBaseCounterTypes.CUSTODIAL:
      return SwapOrderDirection.INTERNAL
    case BASE.type === SwapBaseCounterTypes.ACCOUNT &&
      COUNTER.type === SwapBaseCounterTypes.ACCOUNT:
      return SwapOrderDirection.ON_CHAIN
    case BASE.type === SwapBaseCounterTypes.ACCOUNT &&
      COUNTER.type === SwapBaseCounterTypes.CUSTODIAL:
      return SwapOrderDirection.FROM_USERKEY
    case BASE.type === SwapBaseCounterTypes.CUSTODIAL &&
      COUNTER.type === SwapBaseCounterTypes.ACCOUNT:
      return SwapOrderDirection.TO_USERKEY
    default:
      return SwapOrderDirection.INTERNAL
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

export const getQuoteRefreshConfig = ({
  currentDate,
  expireDate
}: {
  currentDate: Date
  expireDate: Date
}) => {
  const millisecondsUntilRefresh = Math.abs(
    differenceInMilliseconds(expireDate, addSeconds(currentDate, 10))
  )

  return {
    date: addMilliseconds(currentDate, millisecondsUntilRefresh),
    totalMs: millisecondsUntilRefresh
  }
}
