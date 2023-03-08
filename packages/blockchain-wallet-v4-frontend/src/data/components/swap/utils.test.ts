import BigNumber from 'bignumber.js'

import { SwapOrderDirection, SwapPaymentMethod } from '@core/network/api/swap/types'
import { CoinType, SwapProfile } from '@core/types'
import { makeAccount } from 'data/components/swap/test-utils/makeAccount'
import { SwapBaseCounterTypes } from 'data/components/swap/types'
import {
  getDirection,
  getPair,
  getPaymentMethod,
  getProfile,
  getQuoteRefreshConfig,
  interpolatePrice,
  isValidInputAmount
} from 'data/components/swap/utils'

const BASE = makeAccount()
const COUNTER = { ...makeAccount(), baseCoin: 'ETH', coin: 'ETH' as CoinType }

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
    const makeNonCustodialAccount = () => ({
      ...makeAccount(),
      type: SwapBaseCounterTypes.ACCOUNT
    })

    const makeCustodialAccount = () => ({
      ...makeAccount(),
      type: SwapBaseCounterTypes.CUSTODIAL
    })

    it('should return INTERNAL profile when both accounts are custodial', () => {
      expect(getDirection(makeCustodialAccount(), makeCustodialAccount())).toBe(
        SwapOrderDirection.INTERNAL
      )
    })

    it('should return ON_CHAIN profile when both accounts are non-custodial', () => {
      expect(getDirection(makeNonCustodialAccount(), makeNonCustodialAccount())).toBe(
        SwapOrderDirection.ON_CHAIN
      )
    })

    it('should return FROM_USERKEY profile when base is non-custodial and counter is custodial', () => {
      expect(getDirection(makeNonCustodialAccount(), makeCustodialAccount())).toBe(
        SwapOrderDirection.FROM_USERKEY
      )
    })

    it('should return TO_USERKEY profile when base is custodial and counter is non-custodial', () => {
      expect(getDirection(makeCustodialAccount(), makeNonCustodialAccount())).toBe(
        SwapOrderDirection.TO_USERKEY
      )
    })

    it('should return ON_CHAIN string', () => {
      expect(getDirection(BASE, COUNTER)).toBe('ON_CHAIN')
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
    it.each([
      SwapProfile.SWAP_ON_CHAIN,
      SwapProfile.SWAP_FROM_USERKEY,
      SwapProfile.SWAP_TO_USERKEY
    ])('should return DEPOSIT for all non-custodial profiles', (direction) => {
      expect(getPaymentMethod(direction)).toBe(SwapPaymentMethod.Deposit)
    })

    it('should return FUNDS for custodial profile', () => {
      expect(getPaymentMethod(SwapProfile.SWAP_INTERNAL)).toBe(SwapPaymentMethod.Funds)
    })
  })

  // https://github.com/blockchain/service-trading-backend/blob/master/client-quote/src/test/kotlin/info/blockchain/albert/client/interpolate/LinearInterpolationTest.kt
  // assertEquals(7.5, interpolator.interpolate(50.0, 5.0, 100.0, 10.0, 75.0), 0.0)

  describe('interpolatePrice', () => {
    it('should calculate price correctly', () => {
      const simpleTest = interpolatePrice(
        new BigNumber(50),
        new BigNumber(5),
        new BigNumber(100),
        new BigNumber(10),
        new BigNumber(75)
      )
      const sameQty1 = interpolatePrice(
        new BigNumber(50),
        new BigNumber(5),
        new BigNumber(100),
        new BigNumber(10),
        new BigNumber(50)
      )
      const sameQty2 = interpolatePrice(
        new BigNumber(50),
        new BigNumber(5),
        new BigNumber(100),
        new BigNumber(10),
        new BigNumber(100)
      )
      const noQty1 = interpolatePrice(
        new BigNumber(0),
        new BigNumber(0),
        new BigNumber(100),
        new BigNumber(10),
        new BigNumber(50)
      )
      expect(simpleTest).toEqual(7.5)
      expect(sameQty1).toEqual(5)
      expect(sameQty2).toEqual(10)
      expect(noQty1).toEqual(5)
    })
  })

  describe('isValidInputAmount', () => {
    it('should return false for undefined', () => {
      expect(isValidInputAmount(undefined)).toBe(false)
    })

    it('should return false for empty string', () => {
      expect(isValidInputAmount('')).toBe(false)
    })

    it('should return false for string with 0', () => {
      expect(isValidInputAmount('0')).toBe(false)
    })

    it('should return true for string with number larger than 0', () => {
      expect(isValidInputAmount('0.1')).toBe(true)
    })
  })
})
