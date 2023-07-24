import { BSCardType, BuyOrderInputDto } from '@core/network/api/buySell/types'
import { RecurringBuyPeriods } from 'data/components/recurringBuy/types'

import { getCoinFromPair, getFiatFromPair } from '../model'
import { BuyQuoteStateType } from '../types'

export const assembleBuyOrderInputDto = ({
  paymentMethodId,
  period,
  quoteState
}: {
  paymentMethodId?: BSCardType['id']
  period?: RecurringBuyPeriods
  quoteState: BuyQuoteStateType
}): BuyOrderInputDto => {
  const { amount, pairObject, paymentMethod, quote } = quoteState
  const { pair } = pairObject

  const fiat = getFiatFromPair(pair)
  const coin = getCoinFromPair(pair)
  const input = { amount, symbol: fiat }
  const output = { symbol: coin }

  return {
    action: 'BUY',
    input,
    output,
    pair,
    paymentMethodId,
    paymentType: paymentMethod,
    pending: true,
    period: period || RecurringBuyPeriods.ONE_TIME,
    quoteId: quote.quoteId
  }
}
