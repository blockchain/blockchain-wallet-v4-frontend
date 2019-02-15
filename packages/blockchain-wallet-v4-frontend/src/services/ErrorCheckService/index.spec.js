import * as ErrorCheckService from './index'
const VULNERABLE_ADDRESS = '1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH'

describe('ErrorCheckService', () => {
  describe('checkForVulnerableAddressError', () => {
    it('should return an address,', () => {
      expect(
        ErrorCheckService.checkForVulnerableAddressError(
          `A security issue effects address ${VULNERABLE_ADDRESS}. Please Archive It and Contact support@blockchain.zendesk.com`
        )
      ).toEqual(VULNERABLE_ADDRESS)
    })
    it('should return nothing if the check fails', () => {
      expect(
        ErrorCheckService.checkForVulnerableAddressError(
          `There is an issue with the address ${VULNERABLE_ADDRESS}`
        )
      ).toEqual(false)
    })
  })
})
