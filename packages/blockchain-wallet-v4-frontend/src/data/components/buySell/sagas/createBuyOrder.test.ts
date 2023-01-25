import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'

import { BSBuyOrderType, BSPaymentTypes } from '@core/network/api/buySell/types'
import { RecurringBuyPeriods } from 'data/components/recurringBuy/types'

import { getBsCheckoutFormValues } from '../selectors'
import { actions } from '../slice'
import { makeBuyQuoteStateStub } from '../test-utils/makeBuyQuoteStateStub'
import { createBuyOrder } from './createBuyOrder'

const makeQuoteStub = () => ({
  ...makeBuyQuoteStateStub(),
  paymentMethodId: 'OLD_VALUE_TO_BE_IGNORED'
})

const makeOrderStub = ({
  paymentMethodId,
  period
}: {
  paymentMethodId?: string
  period: RecurringBuyPeriods
}): BSBuyOrderType => ({
  expiresAt: '',
  id: '',
  inputCurrency: 'USD',
  inputQuantity: '',
  insertedAt: '',
  outputCurrency: 'BTC',
  outputQuantity: '',
  pair: 'BTC-USD',
  paymentMethodId,
  paymentType: BSPaymentTypes.PAYMENT_CARD,
  period,
  side: 'BUY',
  state: 'PENDING_CONFIRMATION',
  updatedAt: ''
})

describe('createBuyOrder', () => {
  it('should dispatch stop quote refresh', () => {
    return expectSaga(createBuyOrder, {
      quoteState: makeQuoteStub()
    })
      .provide([
        [
          matchers.getContext('api'),
          {
            createOrder: async () => {}
          }
        ]
      ])
      .put(actions.stopPollBuyQuote())
      .silentRun()
  })

  it('should create funds order with correct period and paymentMethodId, dispatch action to cache it and return it', () => {
    const expectedOrder = makeOrderStub({
      paymentMethodId: undefined,
      period: RecurringBuyPeriods.MONTHLY
    })

    return expectSaga(createBuyOrder, {
      quoteState: makeQuoteStub()
    })
      .provide([
        [
          matchers.select(getBsCheckoutFormValues),
          {
            period: RecurringBuyPeriods.MONTHLY
          }
        ],
        [
          matchers.getContext('api'),
          {
            createOrder: makeOrderStub
          }
        ]
      ])
      .put(actions.cachePendingOrder(expectedOrder))
      .silentRun()
      .then((order) => {
        expect(order.returnValue).toEqual(expectedOrder)
      })
  })

  it('should create order with correct period and paymentMethodId, dispatch action to cache it and return it', () => {
    const expectedPaymentMethodId = 'NEW_VALUE_TO_BE_USED'
    const expectedOrder = makeOrderStub({
      paymentMethodId: expectedPaymentMethodId,
      period: RecurringBuyPeriods.MONTHLY
    })

    return expectSaga(createBuyOrder, {
      paymentMethodId: expectedPaymentMethodId,
      quoteState: makeQuoteStub()
    })
      .provide([
        [
          matchers.select(getBsCheckoutFormValues),
          {
            period: RecurringBuyPeriods.MONTHLY
          }
        ],
        [
          matchers.getContext('api'),
          {
            createOrder: makeOrderStub
          }
        ]
      ])
      .put(actions.cachePendingOrder(expectedOrder))
      .silentRun()
      .then((order) => {
        expect(order.returnValue).toEqual(expectedOrder)
      })
  })

  describe('when order creation fails', () => {
    it('should throw', () => {
      const errorStub = new Error('Order creation failed')
      return expectSaga(createBuyOrder, {
        quoteState: makeQuoteStub()
      })
        .provide([
          [
            matchers.getContext('api'),
            {
              createOrder: async () => {
                throw errorStub
              }
            }
          ]
        ])
        .silentRun()
        .catch((e) => {
          expect(e).toBe(errorStub)
        })
    })
  })
})
