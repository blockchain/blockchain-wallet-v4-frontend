import { put, race, take } from 'typed-redux-saga'

import { BSCardType, BSPairsType, BSPaymentTypes } from '@core/network/api/buySell/types'

import { actions as A } from '../slice'

export const createBuyQuoteLoopAndWaitForFirstResult = function* ({
  amount,
  pair,
  paymentMethod,
  paymentMethodId
}: {
  amount: string
  pair: BSPairsType
  paymentMethod: BSPaymentTypes
  paymentMethodId?: BSCardType['id']
}) {
  yield* put(
    A.startPollBuyQuote({
      amount,
      pair,
      paymentMethod,
      paymentMethodId
    })
  )

  yield* race({
    failure: take(A.fetchBuyQuoteFailure.type),
    success: take(A.fetchBuyQuoteSuccess.type)
  })
}
