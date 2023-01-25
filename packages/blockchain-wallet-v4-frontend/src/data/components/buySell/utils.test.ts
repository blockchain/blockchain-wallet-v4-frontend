import { OrderType } from '@core/network/api/buySell/types'
import { getEnterAmountStepType, getQuoteRefreshConfig } from 'data/components/buySell/utils'

describe('buySell utils', () => {
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

  describe('getEnterAmountStepType', () => {
    describe('when order type is undefined', () => {
      it('should return ENTER_AMOUNT string', () => {
        expect(getEnterAmountStepType(undefined)).toBe('ENTER_AMOUNT')
      })
    })

    describe('when order type is BUY', () => {
      it('should return ENTER_AMOUNT string', () => {
        expect(getEnterAmountStepType(OrderType.BUY)).toBe('ENTER_AMOUNT')
      })
    })

    describe('when order type is SELL', () => {
      it('should return SELL_ENTER_AMOUNT string', () => {
        expect(getEnterAmountStepType(OrderType.SELL)).toBe('SELL_ENTER_AMOUNT')
      })
    })
  })

  it.todo('other utils')
})
