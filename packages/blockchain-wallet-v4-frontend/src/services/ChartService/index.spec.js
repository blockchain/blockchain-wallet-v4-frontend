import * as ChartService from './index.js'

describe('ChartService', () => {
  describe('calculateStart()', () => {
    let dateNowSpy

    beforeAll(() => {
      // lock Time to 1/1/2018
      dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => 1517443200000)
    })

    afterAll(() => {
      dateNowSpy.mockReset()
      dateNowSpy.mockRestore()
    })

    it('default start', () => {
      expect(ChartService.calculateStart('BTC', '')).toEqual(1282089600)
    })
    it('1year start', () => {
      expect(ChartService.calculateStart('BTC', '1year')).toEqual('1482537600')
    })
    it('1month start', () => {
      expect(ChartService.calculateStart('BTC', '1month')).toEqual('1514073600')
    })
    it('1week start', () => {
      expect(ChartService.calculateStart('BTC', '1week')).toEqual('1516752000')
    })
    it('1day start', () => {
      expect(ChartService.calculateStart('BTC', '1day')).toEqual('1517356800')
    })
  })

  describe('calculateScale()', () => {
    it('default scale', () => {
      expect(ChartService.calculateScale('BTC', '')).toEqual(432000)
    })
    it('1year scale', () => {
      expect(ChartService.calculateScale('BTC', '1year')).toEqual(86400)
    })
    it('1month scale', () => {
      expect(ChartService.calculateScale('BTC', '1month')).toEqual(7200)
    })
    it('1week scale', () => {
      expect(ChartService.calculateScale('BTC', '1week')).toEqual(3600)
    })
    it('1day scale', () => {
      expect(ChartService.calculateScale('BTC', '1day')).toEqual(900)
    })
  })

  describe('calculateInterval()', () => {
    it('default interval', () => {
      expect(ChartService.calculateInterval('BTC', '')).toEqual(86400000)
    })
    it('1year interval', () => {
      expect(ChartService.calculateInterval('BTC', '1year')).toEqual(86400000)
    })
    it('1month interval', () => {
      expect(ChartService.calculateInterval('BTC', '1month')).toEqual(86400000)
    })
    it('1week interval', () => {
      expect(ChartService.calculateInterval('BTC', '1week')).toEqual(3600000)
    })
    it('1day interval', () => {
      expect(ChartService.calculateInterval('BTC', '1day')).toEqual(3600000)
    })
  })
})
