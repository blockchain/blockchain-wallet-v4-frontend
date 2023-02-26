import { SwapProfile } from '@core/types'
import { makeBaseAccount, makeCounterAccount } from 'data/components/swap/test-utils/makeAccount'
import {
  getDirection,
  getPair,
  getPaymentMethod,
  getProfile,
  getQuoteRefreshConfig
} from 'data/components/swap/utils'

const BASE = makeBaseAccount()
const COUNTER = makeCounterAccount()

describe('swap utils', () => {
  describe('getQuoteRefreshConfig', () => {
    it('should return date and number of ms that are 10s before provided expire date', () => {
      const CURRENT_TIMESTAMP = 1653436800000
      const EXPIRE_OFFSET = 120_000
      const EXPIRE_TIMESTAMP = CURRENT_TIMESTAMP + EXPIRE_OFFSET

      const refreshConfig = getQuoteRefreshConfig({
        currentDate: new Date(CURRENT_TIMESTAMP),
        expireDate: new Date(EXPIRE_TIMESTAMP)
      })

      expect(refreshConfig.date.getTime()).toBe(EXPIRE_TIMESTAMP - 10_000)
      expect(refreshConfig.totalMs).toBe(EXPIRE_OFFSET - 10_000)
    })
  })

  describe('getDirection', () => {
    describe('when both accounts are ACCOUNTS type', () => {
      it('should return ON_CHAIN string', () => {
        expect(getDirection(BASE, COUNTER)).toBe('ON_CHAIN')
      })
    })
  })
  describe('getProfile', () => {
    describe('when both accounts are ACCOUNTS type', () => {
      it('should return SWAP_ON_CHAIN string', () => {
        expect(getProfile(BASE, COUNTER)).toBe('SWAP_ON_CHAIN')
      })
    })
  })
  describe('getPair', () => {
    describe('when both accounts are ACCOUNTS type', () => {
      it('should return BTC-ETH string', () => {
        expect(getPair(BASE, COUNTER)).toBe('BTC-ETH')
      })
    })
  })
  describe('getPaymentMethod', () => {
    it('should return FUNDS string', () => {
      expect(getPaymentMethod(SwapProfile.SWAP_INTERNAL)).toBe('FUNDS')
    })
  })

  it.todo('other utils')
})
