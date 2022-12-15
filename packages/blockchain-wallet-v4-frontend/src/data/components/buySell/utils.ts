import { addMilliseconds, addSeconds, differenceInMilliseconds } from 'date-fns'

import { BSOrderActionType, OrderType, SwapOrderDirectionType } from '@core/types'

import { SwapAccountType, SwapBaseCounterTypes } from '../swap/types'

// eslint-disable-next-line import/prefer-default-export
export const getDirection = (
  from: SwapAccountType
): Exclude<SwapOrderDirectionType, 'TO_USERKEY' | 'ON_CHAIN'> => {
  switch (true) {
    case from.type === SwapBaseCounterTypes.ACCOUNT:
      return 'FROM_USERKEY'
    default:
      return 'INTERNAL'
  }
}

export const reversePair = (pair: string) => {
  const pairArr = pair.split('-')
  const pairReversed = `${pairArr[1]}-${pairArr[0]}`

  return pairReversed
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

export const getEnterAmountStepType = (orderType?: BSOrderActionType) => {
  if (!orderType || orderType === OrderType.BUY) {
    return 'ENTER_AMOUNT'
  }

  return 'SELL_ENTER_AMOUNT'
}
