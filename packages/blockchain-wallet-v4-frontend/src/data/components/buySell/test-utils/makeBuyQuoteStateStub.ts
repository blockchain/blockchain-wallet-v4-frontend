import { BSPaymentTypes } from '@core/network/api/buySell/types'
import { DisplayMode, SettlementReason, SettlementType } from 'data/components/brokerage/types'
import { makePairStub } from 'data/components/buySell/test-utils/makePairStub'

import { BuyQuoteStateType } from '../types'

export const makeBuyQuoteStateStub = (): BuyQuoteStateType => ({
  amount: '1500',
  fee: '49',
  pair: 'BTC-USD',
  pairObject: makePairStub(),
  paymentMethod: BSPaymentTypes.FUNDS,
  paymentMethodId: '1',
  quote: {
    depositTerms: {
      availableToTradeDisplayMode: DisplayMode.DAY_RANGE,
      availableToTradeMinutesMax: 0,
      availableToTradeMinutesMin: 0,
      availableToWithdrawDisplayMode: DisplayMode.DAY_RANGE,
      availableToWithdrawMinutesMax: 0,
      availableToWithdrawMinutesMin: 0,
      creditCurrency: 'USD',
      settlementReason: SettlementReason.GENERIC,
      settlementType: SettlementType.REGULAR,
      withdrawalLockDays: 0
    },
    feeDetails: {
      fee: '49',
      feeFlags: [],
      feeWithoutPromo: '49'
    },
    networkFee: '0',
    price: '5717',
    quoteCreatedAt: '2023-01-04T13:42:02.199Z',
    quoteExpiresAt: '2023-01-04T13:44:02.199Z',
    quoteId: '062ad992-7cb9-44b3-9f01-71f97ccf19b5',
    quoteMarginPercent: 0.5,
    resultAmount: '81954',
    sampleDepositAddress: null,
    settlementDetails: {
      availability: 'REGULAR',
      reason: 'GENERIC'
    },
    staticFee: '0'
  },
  rate: 5717,
  refreshConfig: {
    date: new Date(1672839832199),
    totalMs: 109891
  }
})
