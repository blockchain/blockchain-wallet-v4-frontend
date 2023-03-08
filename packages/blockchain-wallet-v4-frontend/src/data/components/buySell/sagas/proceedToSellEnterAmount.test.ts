/* eslint-disable jest/expect-expect */
import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'

import { BSPaymentMethodType, BSPaymentTypes, OrderType } from '@core/types'
import { actions } from 'data'
import { actions as cacheActions } from 'data/cache/slice'

import { FORM_BS_CHECKOUT } from '../model'
import { getBSPaymentMethod } from '../selectors'
import { actions as buySellActions } from '../slice'
import { makeAccountStub } from '../test-utils/makeAccountStub'
import { makePairStub } from '../test-utils/makePairStub'
import { proceedToSellEnterAmount } from './proceedToSellEnterAmount'

const accountStub = makeAccountStub()

const pairStub = makePairStub()
const paymentMethodStub: BSPaymentMethodType = {
  currency: 'USD',
  limits: {
    max: '',
    min: ''
  },
  type: BSPaymentTypes.PAYMENT_CARD
}
describe('proceedToSellEnterAmount', () => {
  describe('when reset form value', () => {
    it('should dispatch form change', () => {
      return expectSaga(
        proceedToSellEnterAmount,
        buySellActions.proceedToSellEnterAmount({ account: accountStub, pair: pairStub })
      )
        .provide([[matchers.select(getBSPaymentMethod), paymentMethodStub]])
        .put(actions.form.change(FORM_BS_CHECKOUT, 'amount', ''))
        .silentRun()
    })
  })

  describe('when reset last user account', () => {
    it('should update cache', () => {
      return expectSaga(
        proceedToSellEnterAmount,
        buySellActions.proceedToSellEnterAmount({ account: accountStub, pair: pairStub })
      )
        .provide([[matchers.select(getBSPaymentMethod), paymentMethodStub]])
        .put(cacheActions.removeLastUsedAmount({ pair: pairStub.pair }))
        .silentRun()
    })
  })

  describe('when reset is done and we navigate', () => {
    it('should dispatch setStep with payload', () => {
      return expectSaga(
        proceedToSellEnterAmount,
        buySellActions.proceedToSellEnterAmount({ account: accountStub, pair: pairStub })
      )
        .provide([[matchers.select(getBSPaymentMethod), paymentMethodStub]])
        .put(
          buySellActions.setStep({
            cryptoCurrency: 'BTC',
            fiatCurrency: 'USD',
            method: paymentMethodStub,
            orderType: OrderType.SELL,
            pair: pairStub,
            step: 'SELL_ENTER_AMOUNT',
            swapAccount: accountStub
          })
        )
        .silentRun()
    })
  })
})
