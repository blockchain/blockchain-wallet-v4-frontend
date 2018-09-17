import * as ErrorService from './index'

const VULNERABLE_ADDRESS = '1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH'

describe('ErrorService', () => {
  describe('checkForVulnerableAddressError', () => {
    it('should return an address,', () => {
      expect(
        ErrorService.checkForVulnerableAddressError(`A security issue effects address ${VULNERABLE_ADDRESS}. Please Archive It and Contact support@blockchain.zendesk.com`)
      ).toEqual(VULNERABLE_ADDRESS)
    })
    it('should return nothing if the check fails', () => {
      expect(
        ErrorService.checkForVulnerableAddressError(`There is an issue with the address ${VULNERABLE_ADDRESS}`)
      ).toEqual(false)
    })
  })
})