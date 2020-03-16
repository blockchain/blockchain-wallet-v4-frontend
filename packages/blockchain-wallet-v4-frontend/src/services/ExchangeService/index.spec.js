import * as ExchangeService from './index'
const options = {
  platforms: {
    web: {
      coinify: {
        countries: ['UK', 'DE']
      }
    }
  }
}

describe('ExchangeService', () => {
  describe('hasAccount()', () => {
    it('returns "coinify" if user has a coinify offline_token', () => {
      expect(
        ExchangeService.hasAccount({
          coinify: { offline_token: 123 }
        })
      ).toBe('coinify')
    })
    it('returns undefined if user has no token', () => {
      expect(ExchangeService.hasAccount({ coinify: {} })).toBeFalsy()
    })
  })
  describe('findMatch()', () => {
    it('returns "coinify" if user is in EU', () => {
      expect(ExchangeService.findMatch({ country_code: 'UK' }, options)).toBe(
        'coinify'
      )
    })
  })
  describe('canTrade()', () => {
    it('returns "coinify" if user is invited and in region', () => {
      const buySell = { value: { coinify: {} } }
      const settings = { invited: { coinifyBuy: true }, country_code: 'UK' }
      expect(ExchangeService.canTrade(settings, options, buySell, 'Buy')).toBe(
        'coinify'
      )
    })
    it('returns false if there is no partner location match', () => {
      const buySell = { value: { coinify: {} } }
      const settings = { invited: { coinifyBuy: false }, country_code: 'AU' }
      expect(ExchangeService.canTrade(settings, options, buySell, 'Buy')).toBe(
        false
      )
    })
  })
})
