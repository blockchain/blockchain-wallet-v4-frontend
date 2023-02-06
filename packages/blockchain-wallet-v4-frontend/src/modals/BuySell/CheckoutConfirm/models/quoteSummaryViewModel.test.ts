import { BSPaymentTypes } from '@core/types'
import { DisplayMode, SettlementReason, SettlementType } from 'data/components/brokerage/types'
import { BuyQuoteStateType } from 'data/components/buySell/types'

import * as QuoteSummaryViewModel from './quoteSummaryViewModel'

const makeQuoteState = (): BuyQuoteStateType => ({
  amount: '1500',
  fee: '49',
  pair: 'BTC-USD',
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

const makeCoins = (): Coins => ({
  BTC: {
    coinfig: {
      displaySymbol: 'BTC',
      name: 'Bitcoin',
      precision: 8,
      products: [],
      symbol: 'BTC',
      type: {
        logoPngUrl:
          'https://raw.githubusercontent.com/blockchain/coin-definitions/master/extensions/blockchains/bitcoin/info/logo.png',
        minimumOnChainConfirmations: 2,
        name: 'COIN' as const,
        websiteUrl: 'https://bitcoin.org'
      }
    }
  },
  USD: {
    coinfig: {
      displaySymbol: 'USD',
      name: 'US Dollar',
      precision: 2,
      products: [],
      symbol: 'USD',
      type: {
        logoPngUrl: '',
        name: 'FIAT' as const,
        websiteUrl: ''
      }
    }
  }
})

describe('quoteSummaryViewModel', () => {
  describe('make', () => {
    it('should return make and return quote view model with correct values', () => {
      const quoteState = makeQuoteState()
      const coins = makeCoins()
      const viewModel = QuoteSummaryViewModel.make(quoteState, coins)

      expect(viewModel).toEqual({
        cryptoDisplaySymbol: 'BTC',
        depositTerms: quoteState.quote.depositTerms,
        feeText: '$0.49',
        fiatCode: 'USD',
        fiatMinusExplicitFeeText: '$14.51',
        isTermsConsentRequired: false,
        oneCoinPrice: '$17,491.69',
        paymentMethod: quoteState.paymentMethod,
        paymentMethodId: quoteState.paymentMethodId,
        refreshConfig: quoteState.refreshConfig,
        totalCryptoText: '0.00081954 BTC',
        totalFiatText: '$15.00'
      })
    })

    it.each([
      [BSPaymentTypes.PAYMENT_CARD, true],
      [BSPaymentTypes.USER_CARD, true],
      [BSPaymentTypes.BANK_ACCOUNT, false],
      [BSPaymentTypes.FUNDS, false]
    ])(
      'should require terms consent for card payments',
      (paymentMethod, isTermsConsentRequired) => {
        const quoteState = {
          ...makeQuoteState(),
          paymentMethod
        }
        const coins = makeCoins()
        const viewModel = QuoteSummaryViewModel.make(quoteState, coins)

        expect(viewModel).toEqual(
          expect.objectContaining({
            isTermsConsentRequired
          })
        )
      }
    )
  })
})
