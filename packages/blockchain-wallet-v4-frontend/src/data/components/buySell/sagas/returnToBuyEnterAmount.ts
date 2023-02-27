import { put, select } from 'typed-redux-saga'

import { OrderType } from '@core/network/api/buySell/types'

import { getCoinFromPair, getFiatFromPair } from '../model'
import { getBSPaymentMethod } from '../selectors'
import { actions } from '../slice'

export const returnToBuyEnterAmount = function* ({
  payload
}: ReturnType<typeof actions.returnToBuyEnterAmount>) {
  const { pair } = payload
  const paymentMethod = yield* select(getBSPaymentMethod)

  yield* put(
    actions.setStep({
      cryptoCurrency: getCoinFromPair(pair.pair),
      fiatCurrency: getFiatFromPair(pair.pair),
      method: paymentMethod,
      orderType: OrderType.BUY,
      pair,
      step: 'ENTER_AMOUNT'
    })
  )
}
