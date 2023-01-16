import {
  BSPaymentMethodType,
  BSPaymentTypes,
  MobilePaymentType
} from '@core/network/api/buySell/types'
import { Tiers, UserDataType } from 'data/modules/profile/types'

import * as SddFlow from './sddFlow'

describe('SddFlow', () => {
  describe('isSddUser', () => {
    const makeUserDataStub = (currentTier: Tiers['current']) => {
      const tiers: Tiers = {
        current: currentTier,
        next: 2,
        selected: 2
      }

      return {
        tiers
      } as UserDataType
    }

    describe('when user current tier is 1', () => {
      it('should return true', () => {
        const userDataStub = makeUserDataStub(1)

        expect(SddFlow.isSddUser(userDataStub)).toBe(true)
      })
    })

    describe('otherwise', () => {
      it.each([0, 2] as const)('should return false %#', (tier) => {
        const userDataStub = makeUserDataStub(tier)

        expect(SddFlow.isSddUser(userDataStub)).toBe(false)
      })
    })
  })

  describe('isAllowedPaymentType', () => {
    const makePaymentMethodStub = (type: BSPaymentTypes) =>
      ({
        type
      } as BSPaymentMethodType)

    describe('when payment method is card and it is not mobile payment', () => {
      it('should return true', () => {
        const paymentStub = makePaymentMethodStub(BSPaymentTypes.PAYMENT_CARD)

        expect(SddFlow.isAllowedPaymentType(paymentStub, undefined)).toBe(true)
      })
    })

    describe('when payment method is card and it is mobile payment', () => {
      it('should return false', () => {
        const paymentStub = makePaymentMethodStub(BSPaymentTypes.PAYMENT_CARD)

        expect(SddFlow.isAllowedPaymentType(paymentStub, MobilePaymentType.APPLE_PAY)).toBe(false)
      })
    })

    describe('when payment method is not card', () => {
      it.each([BSPaymentTypes.BANK_TRANSFER, BSPaymentTypes.FUNDS])(
        'should return false %#',
        (paymentType) => {
          const paymentStub = makePaymentMethodStub(paymentType)

          expect(SddFlow.isAllowedPaymentType(paymentStub, undefined)).toBe(false)
        }
      )
    })
  })
})
