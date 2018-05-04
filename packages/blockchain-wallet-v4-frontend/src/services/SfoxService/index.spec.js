import * as SfoxService from './index'

describe('SfoxService', () => {
  describe('isVerified()', () => {
    it('should return false by default', () => {
      expect(SfoxService.isVerified({level: null})).toEqual(false)
    })

    it('should return false if level is not "verified"', () => {
      expect(SfoxService.isVerified({level: 'not'})).toEqual(false)
    })

    it('should return false if level is pending but docs are still missing', () => {
      expect(SfoxService.isVerified({level: 'pending', required_docs: [{}, {}]})).toEqual(false)
    })

    it('should return true if status is verified', () => {
      expect(SfoxService.isVerified({level: 'verified'})).toEqual(true)
    })

    it('should return true if status is pending and no required docs are missing', () => {
      expect(SfoxService.isVerified({level: 'verified', required_docs: []})).toEqual(true)
    })
  })

  describe('determineStep()', () => {
    it('should return "account" if profile is empty', () => {
      expect(SfoxService.determineStep()).toEqual('account')
    })

    it('should return "verify" if level is "unverified"', () => {
      expect(SfoxService.determineStep({profile: {}}, {level: 'unverified'})).toEqual('verify')
    })

    it('should return "funding" if accounts.length is zero', () => {
      expect(SfoxService.determineStep({profile: {}}, {level: 'verified'}, [])).toEqual('funding')
    })

    it('should return "verified" if profile and level and accounts exist', () => {
      expect(SfoxService.determineStep({profile: {}}, {level: 'verified'}, [{}])).toEqual('verified')
    })
  })

  describe('determineReason()', () => {
    it('should return "needs_account" if profile is empty', () => {
      expect(SfoxService.determineReason()).toEqual('needs_account')
    })

    it('should return "needs_id" if level is "unverified"', () => {
      expect(SfoxService.determineReason('buy', {profile: {}}, {level: 'unverified'})).toEqual('needs_id')
    })

    it('should return "needs_bank" if accounts.length is zero', () => {
      expect(SfoxService.determineReason('buy', {profile: {}}, {level: 'verified'}, [])).toEqual('needs_bank')
    })

    it('should return "needs_bank_active" if no accounts exist or are not active', () => {
      expect(SfoxService.determineReason('buy', {profile: {}}, {level: 'verified'}, [{}])).toEqual('needs_bank_active')
      expect(SfoxService.determineReason('buy', {profile: {}}, {level: 'verified'}, [{status: 'inactive'}])).toEqual('needs_bank_active')
    })

    it('should return "has_remaining_buy_limit" if account active and type is buy', () => {
      expect(SfoxService.determineReason('buy', {profile: {}}, {level: 'verified'}, [{status: 'active'}])).toEqual('has_remaining_buy_limit')
    })

    it('should return "has_remaining_sell_limit" if account active and type is sell', () => {
      expect(SfoxService.determineReason('sell', {profile: {}}, {level: 'verified'}, [{status: 'active'}])).toEqual('has_remaining_sell_limit')
    })

    it('should return "unknown" if type is neither buy nor sell', () => {
      expect(SfoxService.determineReason('trade', {profile: {}}, {level: 'verified'}, [{status: 'active'}])).toEqual('unknown')
    })
  })

  describe('bodyStatusHelper()', () => {
    it('should return correct object for processing status', () => {
      const status = SfoxService.bodyStatusHelper('processing', true)
      expect(status.text.props.defaultMessage).toEqual('Your buy trade has been initiated. You will receive your bitcoin in 3-5 business days.')
    })

    it('should return correct object for completed status', () => {
      const status = SfoxService.bodyStatusHelper('completed', true)
      expect(status.text.props.defaultMessage).toEqual('Your buy trade is complete!')
    })

    it('should return correct object for rejected status', () => {
      const status = SfoxService.bodyStatusHelper('rejected')
      expect(status.text.props.defaultMessage).toEqual('Your sell trade has been rejected. Please contact support.')
    })

    it('should return correct object for failed status', () => {
      const status = SfoxService.bodyStatusHelper('failed', true)
      expect(status.text.props.defaultMessage).toEqual('Your buy trade failed. Please contact support.')
    })

    it('should return correct object for default status', () => {
      const status = SfoxService.bodyStatusHelper('')
      expect(status.text.props.defaultMessage).toEqual('There are issues with this trade. Please contact support.')
    })
  })

  describe('statusHelper()', () => {
    it('should return correct object for processing status', () => {
      const status = SfoxService.statusHelper('processing')
      expect(status.color).toEqual('transferred')
      expect(status.text.props.defaultMessage).toEqual('Processing')
    })

    it('should return correct object for completed status', () => {
      const status = SfoxService.statusHelper('completed')
      expect(status.color).toEqual('success')
      expect(status.text.props.defaultMessage).toEqual('Completed')
    })

    it('should return correct object for rejected status', () => {
      const status = SfoxService.statusHelper('rejected')
      expect(status.color).toEqual('error')
      expect(status.text.props.defaultMessage).toEqual('Rejected')
    })

    it('should return correct object for failed status', () => {
      const status = SfoxService.statusHelper('failed')
      expect(status.color).toEqual('error')
      expect(status.text.props.defaultMessage).toEqual('Failed')
    })

    it('should return correct object for default status', () => {
      const status = SfoxService.statusHelper('')
      expect(status.color).toEqual('')
      expect(status.text.props.defaultMessage).toEqual('Unknown')
    })
  })
})
