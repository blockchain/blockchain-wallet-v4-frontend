import * as ShapeshiftService from './index'

describe('ShapeshiftService Service', () => {
  describe('getPairFromCoin()', () => {
    it('should return correct BTC pair codes', () => {
      expect(ShapeshiftService.getPairFromCoin('BTC', 'ETH')).toEqual('btc_eth')
      expect(ShapeshiftService.getPairFromCoin('BTC', 'BCH')).toEqual('btc_bch')
    })

    it('should return correct ETH pair codes', () => {
      expect(ShapeshiftService.getPairFromCoin('ETH', 'BTC')).toEqual('eth_btc')
      expect(ShapeshiftService.getPairFromCoin('ETH', 'BCH')).toEqual('eth_bch')
    })

    it('should return correct BCH pair codes', () => {
      expect(ShapeshiftService.getPairFromCoin('BCH', 'BTC')).toEqual('bch_btc')
      expect(ShapeshiftService.getPairFromCoin('BCH', 'ETH')).toEqual('bch_eth')
    })
  })

  describe('getPairFromCoinCamel()', () => {
    it('should return empty string for default', () => {
      expect(ShapeshiftService.getPairFromCoinCamel('', '')).toEqual('')
    })

    it('should return correct BTC pair codes', () => {
      expect(ShapeshiftService.getPairFromCoinCamel('BTC', '')).toEqual('')
      expect(ShapeshiftService.getPairFromCoinCamel('BTC', 'ETH')).toEqual('btcEth')
      expect(ShapeshiftService.getPairFromCoinCamel('BTC', 'BCH')).toEqual('btcBch')
    })

    it('should return correct ETH pair codes', () => {
      expect(ShapeshiftService.getPairFromCoinCamel('ETH', '')).toEqual('')
      expect(ShapeshiftService.getPairFromCoinCamel('ETH', 'BTC')).toEqual('ethBtc')
      expect(ShapeshiftService.getPairFromCoinCamel('ETH', 'BCH')).toEqual('ethBch')
    })

    it('should return correct BCH pair codes', () => {
      expect(ShapeshiftService.getPairFromCoinCamel('BCH', '')).toEqual('')
      expect(ShapeshiftService.getPairFromCoinCamel('BCH', 'BTC')).toEqual('bchBtc')
      expect(ShapeshiftService.getPairFromCoinCamel('BCH', 'ETH')).toEqual('bchEth')
    })
  })

  describe('getCoinFromPair()', () => {
    it('should return empty coins for default', () => {
      expect(ShapeshiftService.getCoinFromPair('', '')).toEqual({ sourceCoin: '', targetCoin: '' })
    })

    it('should return correct BTC pair codes', () => {
      expect(ShapeshiftService.getCoinFromPair('btc_eth')).toEqual({ sourceCoin: 'BTC', targetCoin: 'ETH' })
      expect(ShapeshiftService.getCoinFromPair('btc_bch')).toEqual({ sourceCoin: 'BTC', targetCoin: 'BCH' })
    })

    it('should return correct ETH pair codes', () => {
      expect(ShapeshiftService.getCoinFromPair('eth_btc')).toEqual({ sourceCoin: 'ETH', targetCoin: 'BTC' })
      expect(ShapeshiftService.getCoinFromPair('eth_bch')).toEqual({ sourceCoin: 'ETH', targetCoin: 'BCH' })
    })

    it('should return correct BCH pair codes', () => {
      expect(ShapeshiftService.getCoinFromPair('bch_btc')).toEqual({ sourceCoin: 'BCH', targetCoin: 'BTC' })
      expect(ShapeshiftService.getCoinFromPair('bch_eth')).toEqual({ sourceCoin: 'BCH', targetCoin: 'ETH' })
    })
  })

  describe('formatTrade()', () => {
    let dateNowSpy
    let fakeTimestamp = 1517443101000
    let mockTrade = {
      timestamp: fakeTimestamp,
      quote: { pair: 'btc_eth' }
    }

    beforeAll(() => {
      dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => fakeTimestamp)
    })

    afterAll(() => {
      dateNowSpy.mockReset()
      dateNowSpy.mockRestore()
    })

    it('should return correct formatted trades for btc_eth pair', () => {
      mockTrade.quote.pair = 'btc_eth'
      expect(ShapeshiftService.formatTrade(mockTrade)).toEqual({
        date: expect.any(String),
        quote: { pair: 'btc_eth' },
        sourceCoin: 'BTC',
        targetCoin: 'ETH',
        timestamp: fakeTimestamp
      })
    })

    it('should return correct formatted trades for btc_bch pair', () => {
      mockTrade.quote.pair = 'btc_bch'
      expect(ShapeshiftService.formatTrade(mockTrade)).toEqual({
        date: expect.any(String),
        quote: { pair: 'btc_bch' },
        sourceCoin: 'BTC',
        targetCoin: 'BCH',
        timestamp: fakeTimestamp
      })
    })

    it('should return correct formatted trades for bch_btc pair', () => {
      mockTrade.quote.pair = 'bch_btc'
      expect(ShapeshiftService.formatTrade(mockTrade)).toEqual({
        date: expect.any(String),
        quote: { pair: 'bch_btc' },
        sourceCoin: 'BCH',
        targetCoin: 'BTC',
        timestamp: fakeTimestamp
      })
    })

    it('should return correct formatted trades for bch_eth pair', () => {
      mockTrade.quote.pair = 'bch_eth'
      expect(ShapeshiftService.formatTrade(mockTrade)).toEqual({
        date: expect.any(String),
        quote: { pair: 'bch_eth' },
        sourceCoin: 'BCH',
        targetCoin: 'ETH',
        timestamp: fakeTimestamp
      })
    })

    it('should return correct formatted trades for eth_btc pair', () => {
      mockTrade.quote.pair = 'eth_btc'
      expect(ShapeshiftService.formatTrade(mockTrade)).toEqual({
        date: expect.any(String),
        quote: { pair: 'eth_btc' },
        sourceCoin: 'ETH',
        targetCoin: 'BTC',
        timestamp: fakeTimestamp
      })
    })

    it('should return correct formatted trades for eth_bch pair', () => {
      mockTrade.quote.pair = 'eth_bch'
      expect(ShapeshiftService.formatTrade(mockTrade)).toEqual({
        date: expect.any(String),
        quote: { pair: 'eth_bch' },
        sourceCoin: 'ETH',
        targetCoin: 'BCH',
        timestamp: fakeTimestamp
      })
    })
  })
})
