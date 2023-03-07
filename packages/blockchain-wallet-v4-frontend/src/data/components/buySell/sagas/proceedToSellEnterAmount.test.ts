/* eslint-disable jest/expect-expect */
import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'

import { BSPaymentMethodType, BSPaymentTypes, OrderType } from '@core/types'

import { getBSPaymentMethod } from '../selectors'
import { actions } from '../slice'
import { makeAccountStub } from '../test-utils/makeAccountStub'
import { makePairStub } from '../test-utils/makePairStub'
import { proceedToSellEnterAmount } from './proceedToSellEnterAmount'

const accountStub = makeAccountStub()

describe('proceedToSellEnterAmount', () => {
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

    return expectSaga(
      proceedToSellEnterAmount,
      actions.proceedToSellEnterAmount({ account: accountStub, pair: pairStub })
    )
      .provide([[matchers.select(getBSPaymentMethod), paymentMethodStub]])
      .put(
        actions.setStep({
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
