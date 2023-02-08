import { BSPaymentTypes } from '@core/types'
import { makeBuyQuoteStateStub } from 'data/components/buySell/test-utils/makeBuyQuoteStateStub'

import * as QuoteSummaryViewModel from './quoteSummaryViewModel'

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
      const quoteStateStub = makeBuyQuoteStateStub()
      const coins = makeCoins()
      const viewModel = QuoteSummaryViewModel.make(quoteStateStub, coins)

      expect(viewModel).toEqual({
        cryptoDisplaySymbol: 'BTC',
        depositTerms: quoteStateStub.quote.depositTerms,
        feeText: '$0.49',
        fiatAmountBase: '1500',
        fiatCode: 'USD',
        fiatMinusExplicitFeeText: '$14.51',
        isTermsConsentRequired: false,
        oneCoinPrice: '$17,491.69',
        paymentMethod: quoteStateStub.paymentMethod,
        paymentMethodId: quoteStateStub.paymentMethodId,
        quoteState: quoteStateStub,
        refreshConfig: quoteStateStub.refreshConfig,
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
        const quoteStateStub = {
          ...makeBuyQuoteStateStub(),
          paymentMethod
        }
        const coins = makeCoins()
        const viewModel = QuoteSummaryViewModel.make(quoteStateStub, coins)

        expect(viewModel).toEqual(
          expect.objectContaining({
            isTermsConsentRequired
          })
        )
      }
    )
  })
})
