import { RecurringBuyPeriods } from 'data/components/recurringBuy/types'

import { makeBuyQuoteStateStub } from '../test-utils/makeBuyQuoteStateStub'
import { assembleBuyOrderInputDto } from './assembleBuyOrderInputDto'

const makeQuoteState = () => ({
  ...makeBuyQuoteStateStub(),
  paymentMethodId: 'ORIGINAL_PAYMENT_ID_TO_BE_IGNORED'
})

describe('assembleBuyOrderInputDto', () => {
  it('should use provided paymentMethodId, period and quoteState to generate order input dto', () => {
    const quoteState = makeQuoteState()
    const paymentMethodId = 'PAYMENT_ID'
    const period = RecurringBuyPeriods.WEEKLY

    expect(
      assembleBuyOrderInputDto({
        paymentMethodId,
        period,
        quoteState
      })
    ).toEqual({
      action: 'BUY',
      input: {
        amount: '1500',
        symbol: 'USD'
      },
      output: {
        symbol: 'BTC'
      },
      pair: 'BTC-USD',
      paymentMethodId: 'PAYMENT_ID',
      paymentType: 'FUNDS',
      pending: true,
      period: 'WEEKLY',
      quoteId: '062ad992-7cb9-44b3-9f01-71f97ccf19b5'
    })
  })

  describe('when paymentMethodId is missing', () => {
    it('should not use quoteState paymentMethodId', () => {
      const quoteState = makeQuoteState()

      expect(
        assembleBuyOrderInputDto({
          paymentMethodId: undefined,
          period: undefined,
          quoteState
        })
      ).toEqual(
        expect.objectContaining({
          paymentMethodId: undefined
        })
      )
    })
  })

  describe('when period is missing', () => {
    it('should make one time order input dto', () => {
      const quoteState = makeQuoteState()

      expect(
        assembleBuyOrderInputDto({
          paymentMethodId: undefined,
          period: undefined,
          quoteState
        })
      ).toEqual(
        expect.objectContaining({
          period: RecurringBuyPeriods.ONE_TIME
        })
      )
    })
  })
})
