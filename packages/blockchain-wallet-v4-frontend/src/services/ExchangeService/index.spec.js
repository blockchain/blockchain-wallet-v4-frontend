import * as ExchangeService from './index.js'
const options = {
  platforms: {
    web: {
      'sfox': {
        'states': ['CA', 'PA', 'MA'],
        'countries': ['US']
      },
      'coinify': {
        'countries': ['UK', 'DE']
      }
    }
  }
}

describe('ExchangeService', () => {
  describe('hasAccount()', () => {
    it('returns "sfox" if user has a sfox offline_token', () => {
      expect(ExchangeService.hasAccount({ sfox: { 'offline_token': 123 }, coinify: {} })).toBe('sfox')
    })
    it('returns "coinify" if user has a coinify offline_token', () => {
      expect(ExchangeService.hasAccount({ sfox: {}, coinify: { 'offline_token': 123 } })).toBe('coinify')
    })
    it('returns undefined if user has no token', () => {
      expect(ExchangeService.hasAccount({ coinify: {}, sfox: {} })).toBeFalsy()
    })
  })
  describe('findMatch()', () => {
    it('returns "sfox" if user is in US', () => {
      expect(ExchangeService.findMatch({ 'country_code': 'US' }, options)).toBe('sfox')
    })
    it('returns "coinify" if user is in EU', () => {
      expect(ExchangeService.findMatch({ 'country_code': 'UK' }, options)).toBe('coinify')
    })
  })
  describe('canTrade()', () => {
    it('returns "sfox" if user is invited and in region', () => {
      const buySell = { value: { sfox: {}, coinify: {} } }
      const settings = { invited: { 'sfoxBuy': true }, 'country_code': 'US' }
      expect(ExchangeService.canTrade(settings, options, buySell, 'Buy')).toBe('sfox')
    })
    it('returns "coinify" if user is invited and in region', () => {
      const buySell = { value: { sfox: {}, coinify: {} } }
      const settings = { invited: { 'coinifyBuy': true }, 'country_code': 'UK' }
      expect(ExchangeService.canTrade(settings, options, buySell, 'Buy')).toBe('coinify')
    })
    it('returns false if there is no partner location match', () => {
      const buySell = { value: { sfox: {}, coinify: {} } }
      const settings = { invited: { 'coinifyBuy': false }, 'country_code': 'AU' }
      expect(ExchangeService.canTrade(settings, options, buySell, 'Buy')).toBe(false)
    })
  })
})
