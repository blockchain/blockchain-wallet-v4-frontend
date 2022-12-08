import { countryCodes, postCodeExistsForCountry, postCodeValidator } from '.'

const COUNTRY_INVALID = 'XX'
const AR_POSTCODE = 'C1408BSK'
const AR_POSTCODE_NON_NORMALIZED = 'C-14-0 8 B SK' // not normalized post code
const AR_INVALID_POSTCODE = 'xxC1408BSK'
const RS_POSTCODE = '24224'
const RS_INVALID_POSTCODE = '24224not_valid'

describe('PostCode validator', () => {
  describe('Check if country have zip code validation', () => {
    it('should return true in case of existing country', () => {
      const isCountrySupported = postCodeExistsForCountry(countryCodes.US)

      expect(isCountrySupported).toEqual(true)
    })
    it('should return false for not existing country code', () => {
      const isCountrySupported = postCodeExistsForCountry(COUNTRY_INVALID)

      expect(isCountrySupported).toEqual(false)
    })
  })

  describe('Check if postCode/Zip is valid', () => {
    it('should return true in case of valid zip code for country', () => {
      const isArgentinaValidCode = postCodeValidator(countryCodes.AR, AR_POSTCODE)

      expect(isArgentinaValidCode).toEqual(true)

      const isSerbiaValidCode = postCodeValidator(countryCodes.RS, RS_POSTCODE)

      expect(isSerbiaValidCode).toEqual(true)

      const isArgentinaNonNormalizedValidCode = postCodeValidator(
        countryCodes.AR,
        AR_POSTCODE_NON_NORMALIZED
      )

      expect(isArgentinaNonNormalizedValidCode).toEqual(true)
    })
    it('should return false for invalid zip code country code', () => {
      const isArgentinaValidCode = postCodeValidator(countryCodes.AR, AR_INVALID_POSTCODE)

      expect(isArgentinaValidCode).toEqual(false)

      const isSerbiaValidCode = postCodeValidator(countryCodes.RS, RS_INVALID_POSTCODE)

      expect(isSerbiaValidCode).toEqual(false)
    })

    it('should return throw error in case of not existing country', () => {
      expect(() => postCodeValidator(COUNTRY_INVALID, AR_POSTCODE)).toThrow(
        Error('Invalid country code: XX')
      )
    })
  })
})
