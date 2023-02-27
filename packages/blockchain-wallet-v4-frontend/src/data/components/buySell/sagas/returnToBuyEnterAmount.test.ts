import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'

import { BSPaymentMethodType, BSPaymentTypes, OrderType } from '@core/types'

import { getBSPaymentMethod } from '../selectors'
import { actions } from '../slice'
import { makePairStub } from '../test-utils/makePairStub'
import { returnToBuyEnterAmount } from './returnToBuyEnterAmount'

describe('returnToBuyEnterAmount', () => {
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

    return expectSaga(returnToBuyEnterAmount, actions.returnToBuyEnterAmount({ pair: pairStub }))
      .provide([[matchers.select(getBSPaymentMethod), paymentMethodStub]])
      .put(
        actions.setStep({
          cryptoCurrency: 'BTC',
          fiatCurrency: 'USD',
          method: paymentMethodStub,
          orderType: OrderType.BUY,
          pair: pairStub,
          step: 'ENTER_AMOUNT'
        })
      )
      .silentRun()
  })
})
