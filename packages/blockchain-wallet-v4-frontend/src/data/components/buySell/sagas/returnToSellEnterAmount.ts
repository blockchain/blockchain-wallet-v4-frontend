import { put, select } from 'typed-redux-saga'

import { OrderType } from '@core/network/api/buySell/types'

import { getCoinFromPair, getFiatFromPair } from '../model'
import { getBSPaymentMethod } from '../selectors'
import { actions } from '../slice'

export const returnToSellEnterAmount = function* ({
  payload
}: ReturnType<typeof actions.returnToSellEnterAmount>) {
  const { pair } = payload
  const paymentMethod = yield* select(getBSPaymentMethod)

  yield* put(actions.stopPollSellQuote())

  yield* put(
    actions.setStep({
      cryptoCurrency: getCoinFromPair(pair.pair),
      fiatCurrency: getFiatFromPair(pair.pair),
      method: paymentMethod,
      orderType: OrderType.SELL,
      pair,
      step: 'SELL_ENTER_AMOUNT'
    })
  )
}
