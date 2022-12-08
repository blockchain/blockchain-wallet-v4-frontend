import { getTwoFaType } from './utils'

describe('Login utils', () => {
  describe('Check 2Fa type', () => {
    it('should return YUBIKEY', () => {
      const isYubikey = getTwoFaType(1)

      expect(isYubikey).toEqual('YUBIKEY')
    })
    it('should return SMS', () => {
      const isSMS = getTwoFaType(4)

      expect(isSMS).toEqual('SMS')
    })
    it('should return OTP', () => {
      const isOTPCode = getTwoFaType(3)

      expect(isOTPCode).toEqual('OTP_CODE')
    })
    it('should return null', () => {
      const isNull = getTwoFaType(0)

      expect(isNull).toBeNull()
    })
  })
})
