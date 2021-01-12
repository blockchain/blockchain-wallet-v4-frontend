import * as ChartService from './index.ts'

describe('ChartService', () => {
  describe('calculateScale()', () => {
    it('default scale', () => {
      expect(ChartService.calculateScale('BTC', '')).toEqual(432000)
    })
    it('year scale', () => {
      expect(ChartService.calculateScale('BTC', 'year')).toEqual(86400)
    })
    it('month scale', () => {
      expect(ChartService.calculateScale('BTC', 'month')).toEqual(7200)
    })
    it('week scale', () => {
      expect(ChartService.calculateScale('BTC', 'week')).toEqual(3600)
    })
    it('day scale', () => {
      expect(ChartService.calculateScale('BTC', 'day')).toEqual(900)
    })
  })

  describe('calculateInterval()', () => {
    it('default interval', () => {
      expect(ChartService.calculateInterval('BTC', '')).toEqual(86400000)
    })
    it('year interval', () => {
      expect(ChartService.calculateInterval('BTC', 'year')).toEqual(86400000)
    })
    it('month interval', () => {
      expect(ChartService.calculateInterval('BTC', 'month')).toEqual(86400000)
    })
    it('week interval', () => {
      expect(ChartService.calculateInterval('BTC', 'week')).toEqual(3600000)
    })
    it('day interval', () => {
      expect(ChartService.calculateInterval('BTC', 'day')).toEqual(3600000)
    })
  })
})
