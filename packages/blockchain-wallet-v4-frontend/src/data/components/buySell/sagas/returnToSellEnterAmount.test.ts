/* eslint-disable jest/expect-expect */
import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'

import { BSPaymentMethodType, BSPaymentTypes, OrderType } from '@core/types'

import { getBSPaymentMethod } from '../selectors'
import { actions } from '../slice'
import { makePairStub } from '../test-utils/makePairStub'
import { returnToSellEnterAmount } from './returnToSellEnterAmount'

describe('returnToSellEnterAmount', () => {
  it('should dispatch setStep with payload', () => {
    const pairStub = makePairStub()
    const paymentMethodStub: BSPaymentMethodType = {
      currency: 'USD',
      limits: {
        max: '',
        min: ''
      },
      type: BSPaymentTypes.PAYMENT_CARD
    }

    return expectSaga(returnToSellEnterAmount, actions.returnToSellEnterAmount({ pair: pairStub }))
      .provide([[matchers.select(getBSPaymentMethod), paymentMethodStub]])
      .put(
        actions.setStep({
          cryptoCurrency: 'BTC',
          fiatCurrency: 'USD',
          method: paymentMethodStub,
          orderType: OrderType.SELL,
          pair: pairStub,
          step: 'SELL_ENTER_AMOUNT'
        })
      )
      .silentRun()
  })
})
