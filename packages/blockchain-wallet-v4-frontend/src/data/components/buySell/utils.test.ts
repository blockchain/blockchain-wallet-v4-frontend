import { getQuoteRefreshConfig } from 'data/components/buySell/utils'

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

  it.todo('other utils')
})
