import * as CoinifyService from './index'

fdescribe('CoinifyService', () => {
  const mockedLimits = (max, min) => ({
    bank: {
      inRemaining: { EUR: max, USD: 100, GBP: 100, DKK: 100 },
      minimumInAmounts: { EUR: min, USD: 0, GBP: 0, DKK: 0 }
    },
    card: {
      inRemaining: { EUR: max, USD: 100, GBP: 100, DKK: 100 },
      minimumInAmounts: { EUR: min, USD: 0, GBP: 0, DKK: 0 }
    },
    blockchain: {
      inRemaining: { BTC: 1 },
      minimumInAmounts: { BTC: 0 }
    }
  })
  const correctLimits = {
    buy: {
      min: 0,
      max: 100,
      bankMax: 100,
      cardMax: 100
    },
    sell: {
      min: 0,
      max: 1,
      effectiveMax: 0.5
    }
  }
  const baseFiatQuote = {
    id: 10,
    baseCurrency: 'EUR',
    quoteCurrency: 'BTC',
    baseAmount: 10,
    quoteAmount: 100000,
    paymentMediums: {
      card: {
        outFixedFees: {
          BTC: 0.0001
        }
      }
    }
  }
  const baseBtcQuote = {
    id: 11,
    baseCurrency: 'BTC',
    quoteCurrency: 'EUR',
    baseAmount: 100000,
    quoteAmount: 10
  }

  describe('getLimits()', () => {
    it('should return the correct limits', () => {
      expect(CoinifyService.getLimits(mockedLimits(100, 0), 'EUR', 0.5)).toEqual(correctLimits)
    })
  })
  describe('getLimitsError', () => {
    it('should return max_below_min', () => {
      expect(CoinifyService.getLimitsError(25, mockedLimits(10, 50), 'EUR', 'buy')).toEqual('max_below_min')
    })
    it('should return over_max', () => {
      expect(CoinifyService.getLimitsError(25, mockedLimits(2, 0), 'EUR', 'buy')).toEqual('over_max')
    })
    it('should return under_min', () => {
      expect(CoinifyService.getLimitsError(25, mockedLimits(100, 50), 'EUR', 'buy')).toEqual('under_min')
    })
  })
  describe('isMinOverEffectiveMax', () => {
    it('should return false', () => {
      expect(CoinifyService.isMinOverEffectiveMax(mockedLimits(100, 10), 0.5, 'EUR')).toEqual(false)
    })
  })
  describe('getRateFromQuote', () => {
    it('should return the rate', () => {
      expect(CoinifyService.getRateFromQuote(baseFiatQuote)).toEqual('€10,000.00')
    })
    it('should return the rate if base is BTC', () => {
      expect(CoinifyService.getRateFromQuote(baseBtcQuote)).toEqual('€10,000.00')
    })
  })
  describe('reviewOrder', () => {
    it('should return the minerFee', () => {
      expect(CoinifyService.reviewOrder.renderMinerFeeRow(baseFiatQuote, 'card', 'buy')).toEqual(0.0001)
    })
    it('should render the first row', () => {
      expect(CoinifyService.reviewOrder.renderFirstRow(baseFiatQuote)).toEqual('0.001 BTC')
    })
    it('should render the btc to be received', () => {
      expect(CoinifyService.reviewOrder.renderBtcToBeReceived(baseFiatQuote, 'card', 'buy')).toEqual('0.00090000')
    })
    it('should render the amount row', () => {
      expect(CoinifyService.reviewOrder.renderAmountRow(baseFiatQuote)).toEqual('€10.00')
    })
  })
})
