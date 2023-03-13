import { put, select } from 'typed-redux-saga'

import { OrderType } from '@core/network/api/buySell/types'
import { actions } from 'data'
import { actions as cacheActions } from 'data/cache/slice'

import { FORM_BS_CHECKOUT, getCoinFromPair, getFiatFromPair } from '../model'
import { getBSPaymentMethod } from '../selectors'
import { actions as buySellActions } from '../slice'

export const proceedToSellEnterAmount = function* ({
  payload
}: ReturnType<typeof buySellActions.proceedToSellEnterAmount>) {
  const { account, pair } = payload
  const paymentMethod = yield* select(getBSPaymentMethod)

  yield* put(
    cacheActions.removeLastUsedAmount({
      pair: pair.pair
    })
  )

  yield* put(actions.form.change(FORM_BS_CHECKOUT, 'amount', ''))

  yield* put(
    buySellActions.setStep({
      cryptoCurrency: getCoinFromPair(pair.pair),
      fiatCurrency: getFiatFromPair(pair.pair),
      method: paymentMethod,
      orderType: OrderType.SELL,
      pair,
      step: 'SELL_ENTER_AMOUNT',
      swapAccount: account
    })
  )
}
