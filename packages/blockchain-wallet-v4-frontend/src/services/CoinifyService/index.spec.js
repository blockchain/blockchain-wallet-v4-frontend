import { Remote } from 'blockchain-wallet-v4/src'

import * as CoinifyService from './index'
import { KYC_STATES } from '../../data/modules/profile/model'
const { NONE, PENDING, UNDER_REVIEW, VERIFIED, REJECTED, EXPIRED } = KYC_STATES

describe('CoinifyService', () => {
  const mockedLimits = (max, min) => ({
    bank: {
      inRemaining: { EUR: max, USD: 100, GBP: 100, DKK: 100 },
      minimumInAmounts: { EUR: min, USD: 0, GBP: 0, DKK: 0 }
    },
    card: {
      inRemaining: { EUR: max, USD: 100, GBP: 100, DKK: 100 },
      minimumInAmounts: { EUR: min, USD: 0, GBP: 0, DKK: 0 }
    },
    blockchain: {
      inRemaining: { BTC: 1 },
      minimumInAmounts: { BTC: 0 }
    }
  })
  const correctLimits = {
    buy: {
      min: 0,
      max: 100,
      bankMax: 100,
      cardMax: 100
    },
    sell: {
      min: 0,
      max: 1,
      effectiveMax: 0.5
    }
  }
  const baseFiatQuote = {
    id: 10,
    baseCurrency: 'EUR',
    quoteCurrency: 'BTC',
    baseAmount: 10,
    quoteAmount: 100000,
    paymentMediums: {
      card: {
        fee: 0.1,
        outFixedFees: {
          BTC: 0.0001
        },
        total: 10.1
      }
    }
  }
  const baseBtcQuote = {
    id: 11,
    baseCurrency: 'BTC',
    quoteCurrency: 'EUR',
    baseAmount: 100000,
    quoteAmount: 10
  }

  const effectiveBalance = 0.5

  describe('getLimits()', () => {
    it('should return the correct limits', () => {
      expect(
        CoinifyService.getLimits(mockedLimits(100, 0), 'EUR', effectiveBalance)
      ).toEqual(correctLimits)
    })
  })
  describe('getLimitsError', () => {
    it('should return max_below_min', () => {
      expect(
        CoinifyService.getLimitsError(25, mockedLimits(10, 50), 'EUR', 'buy')
      ).toEqual('max_below_min')
    })
    it('should return over_max', () => {
      expect(
        CoinifyService.getLimitsError(25, mockedLimits(2, 0), 'EUR', 'buy')
      ).toEqual('over_max')
    })
    it('should return under_min', () => {
      expect(
        CoinifyService.getLimitsError(25, mockedLimits(100, 50), 'EUR', 'buy')
      ).toEqual('under_min')
    })
  })
  describe('isMinOverEffectiveMax', () => {
    it('should return false', () => {
      expect(
        CoinifyService.isMinOverEffectiveMax(
          mockedLimits(100, 10),
          effectiveBalance,
          'EUR'
        )
      ).toEqual(false)
    })
  })
  describe('getRateFromQuote', () => {
    it('should return the rate', () => {
      expect(CoinifyService.getRateFromQuote(baseFiatQuote)).toEqual(
        '€10,000.00'
      )
    })
    it('should return the rate if base is BTC', () => {
      expect(CoinifyService.getRateFromQuote(baseBtcQuote)).toEqual(
        '€10,000.00'
      )
    })
  })
  describe('reviewOrder', () => {
    it('should return the minerFee', () => {
      expect(
        CoinifyService.reviewOrder.renderMinerFeeRow(
          baseFiatQuote,
          'card',
          'buy'
        )
      ).toEqual(0.0001)
    })
    it('should render the first row', () => {
      expect(CoinifyService.reviewOrder.renderFirstRow(baseFiatQuote)).toEqual(
        '0.001 BTC'
      )
    })
    it('should render the btc to be received', () => {
      expect(
        CoinifyService.reviewOrder.renderBtcToBeReceived(
          baseFiatQuote,
          'card',
          'buy'
        )
      ).toEqual('0.00090000')
    })
    it('should render the amount row', () => {
      expect(CoinifyService.reviewOrder.renderAmountRow(baseFiatQuote)).toEqual(
        '€10.00'
      )
    })
    it('should render the amount row with a base btc quote', () => {
      expect(CoinifyService.reviewOrder.renderAmountRow(baseBtcQuote)).toEqual(
        '€10.00'
      )
    })
    it('should render the fee row', () => {
      expect(
        CoinifyService.reviewOrder.renderFeeRow(baseFiatQuote, 'card', 'buy')
      ).toEqual('€0.10')
    })
    it('should render the total row', () => {
      expect(
        CoinifyService.reviewOrder.renderTotalRow(baseFiatQuote, 'card', 'buy')
      ).toEqual('€10.10')
    })
  })
  describe('statusHelper', () => {
    it('should return the correct object for reviewing status', () => {
      const status = CoinifyService.statusHelper('reviewing')
      expect(status.text.props.defaultMessage).toEqual('Pending')
    })
    it('should return the correct object for awaiting_transfer_in status', () => {
      const status = CoinifyService.statusHelper('awaiting_transfer_in')
      expect(status.text.props.defaultMessage).toEqual('Pending')
    })
    it('should return the correct object for processing status', () => {
      const status = CoinifyService.statusHelper('processing')
      expect(status.text.props.defaultMessage).toEqual('Pending')
    })
    it('should return the correct object for completed status', () => {
      const status = CoinifyService.statusHelper('completed')
      expect(status.text.props.defaultMessage).toEqual('Completed')
    })
    it('should return the correct object for rejected status', () => {
      const status = CoinifyService.statusHelper('rejected')
      expect(status.text.props.defaultMessage).toEqual('Rejected')
    })
    it('should return the correct object for failed status', () => {
      const status = CoinifyService.statusHelper('failed')
      expect(status.text.props.defaultMessage).toEqual('Failed')
    })
    it('should return the correct object for cancelled status', () => {
      const status = CoinifyService.statusHelper('cancelled')
      expect(status.text.props.defaultMessage).toEqual('Cancelled')
    })
    it('should return the correct object for expired status', () => {
      const status = CoinifyService.statusHelper('expired')
      expect(status.text.props.defaultMessage).toEqual('Expired')
    })
    it('should return the correct object for default', () => {
      const status = CoinifyService.statusHelper('unknown')
      expect(status.text.props.defaultMessage).toEqual('Unknown')
      expect(status.color).toEqual('grey700')
    })
  })
  describe('bodyStatusHelper', () => {
    it('should return the correct text for reviewing status', () => {
      const status = CoinifyService.bodyStatusHelper('reviewing', 'buy')
      expect(status.text.props.defaultMessage).toEqual(
        'Your purchase is currently being processed. Our exchange partner will send a status update your way within 1 business day.'
      )
    })
    it('should return the correct text for awaiting transfer in status', () => {
      const status = CoinifyService.bodyStatusHelper(
        'awaiting_transfer_in',
        'buy'
      )
      expect(status.text.props.defaultMessage).toEqual(
        'Your purchase is currently being processed. Our exchange partner will send a status update your way within 1 business day.'
      )
    })
    it('should return the correct text for processing status', () => {
      const status = CoinifyService.bodyStatusHelper('processing', 'buy')
      expect(status.text.props.defaultMessage).toEqual(
        'Your purchase is currently being processed. Our exchange partner will send a status update your way within 1 business day.'
      )
    })
    it('should return the correct text for completed status', () => {
      const status = CoinifyService.bodyStatusHelper('completed', 'buy')
      expect(status.text).toEqual('')
    })
    it('should return the correct text for rejected status', () => {
      const status = CoinifyService.bodyStatusHelper('rejected', 'buy')
      expect(status.text.props.defaultMessage).toEqual(
        'Your buy trade has been rejected. Please contact support.'
      )
    })
  })
  describe('kycHeaderHelper', () => {
    it('should return the correct object for NONE status', () => {
      const status = CoinifyService.kycHeaderHelper(NONE)
      expect(status.text.props.defaultMessage).toEqual('Incomplete')
    })
    it('should return the correct object for PENDING status', () => {
      const status = CoinifyService.kycHeaderHelper(PENDING)
      expect(status.text.props.defaultMessage).toEqual('Pending')
    })
    it('should return the correct object for UNDER_REVIEW status', () => {
      const status = CoinifyService.kycHeaderHelper(UNDER_REVIEW)
      expect(status.text.props.defaultMessage).toEqual('In Review')
    })
    it('should return the correct object for VERIFIED status', () => {
      const status = CoinifyService.kycHeaderHelper(VERIFIED)
      expect(status.text.props.defaultMessage).toEqual('Completed')
    })
    it('should return the correct object for REJECTED status', () => {
      const status = CoinifyService.kycHeaderHelper(REJECTED)
      expect(status.text.props.defaultMessage).toEqual('Failed')
    })
    it('should return the correct object for EXPIRED status', () => {
      const status = CoinifyService.kycHeaderHelper(EXPIRED)
      expect(status.text.props.defaultMessage).toEqual('Expired')
    })
    it('should return the correct object for default', () => {
      const status = CoinifyService.kycHeaderHelper('unknown')
      expect(status.text).toEqual('')
    })
  })
  describe('kycBodyHelper', () => {
    it('should return the correct object for reviewing status', () => {
      const status = CoinifyService.kycBodyHelper('reviewing')
      expect(status.text.props.defaultMessage).toEqual(
        'Your request for authentication has been submitted and will be reviewed shortly. Coinify will email you a status updated within 48 business hours. If you have any questions about the status of your submission, feel free to reach out to Coinify directly at www.coinify.com/support'
      )
    })
    it('should return the correct object for processing status', () => {
      const status = CoinifyService.kycBodyHelper('processing')
      expect(status.text.props.defaultMessage).toEqual(
        'Your request for authentication has been submitted and will be reviewed shortly. Coinify will email you a status updated within 48 business hours. If you have any questions about the status of your submission, feel free to reach out to Coinify directly at www.coinify.com/support'
      )
    })
    it('should return the correct object for pending status', () => {
      const status = CoinifyService.kycBodyHelper('pending')
      expect(status.text.props.defaultMessage).toEqual(
        'Your identity verification is processing.'
      )
    })
    it('should return the correct object for completed status', () => {
      const status = CoinifyService.kycBodyHelper('completed')
      expect(status.text.props.defaultMessage).toEqual(
        'Your identity verification is complete! Your limits have been raised.'
      )
    })
    it('should return the correct object for rejected status', () => {
      const status = CoinifyService.kycBodyHelper('rejected')
      expect(status.text.props.defaultMessage).toEqual(
        'There was an issue verifying your identity with the documents provided. Please try uploading different identification. Bank transfers are unavailable until we can successfully verify your identity.'
      )
    })
    it('should return the correct object for failed status', () => {
      const status = CoinifyService.kycBodyHelper('failed')
      expect(status.text.props.defaultMessage).toEqual(
        'Your identity verification has failed. Please contact support.'
      )
    })
    it('should return the correct object for cancelled status', () => {
      const status = CoinifyService.kycBodyHelper('cancelled')
      expect(status.text.props.defaultMessage).toEqual(
        'Your identity verification was cancelled. Please try again.'
      )
    })
    it('should return the correct object for default', () => {
      const status = CoinifyService.kycBodyHelper('unknown')
      expect(status.text.props.defaultMessage).toEqual(
        'Your identity verification status could not be determined, please contact support.'
      )
    })
  })
  describe('kycNotificationBodyHelper', () => {
    it('should return the correct object for UNDER_REIVEW', () => {
      const status = CoinifyService.kycNotificationBodyHelper(UNDER_REVIEW)
      expect(status.text.props.defaultMessage).toEqual(
        'We had some trouble verifying your account with the documents provided. Our Support team will contact you shortly to help you with the verification process.'
      )
    })
    it('should return the correct object for PENDING', () => {
      const status = CoinifyService.kycNotificationBodyHelper(PENDING)
      expect(status.text.props.defaultMessage).toEqual(
        'We are currently reviewing your application. Hang tight! In just a few minutes you will be all set to buy & sell cryptocurrency.\n {note} In some cases it can take up to 2 hours to get verified.'
      )
    })
    it('should return the correct object for NONE', () => {
      const status = CoinifyService.kycNotificationBodyHelper(NONE)
      expect(status.text.props.defaultMessage).toEqual(
        "It looks like you started your identity verification but didn't finish. Complete this process to link your bank account and/or increase your buy & sell limits."
      )
    })
    it('should return the correct object for VERIFIED', () => {
      const status = CoinifyService.kycNotificationBodyHelper(VERIFIED)
      expect(status.text.props.defaultMessage).toEqual(
        'Your identity verification is complete! Your limits have been raised.'
      )
    })
    it('should return the correct object for EXPIRED', () => {
      const status = CoinifyService.kycNotificationBodyHelper(EXPIRED)
      expect(status.text.props.defaultMessage).toEqual(
        'Your identity verification request has expired.'
      )
    })
    it('should return the correct object for REJECTED', () => {
      const status = CoinifyService.kycNotificationBodyHelper(REJECTED)
      expect(status.text.props.defaultMessage).toEqual(
        'Unfortunately we had some trouble with the documents that you’ve supplied and we can’t verifiy your account at this time. {learnMore}'
      )
    })
    it('should return the correct object for default', () => {
      const status = CoinifyService.kycNotificationBodyHelper('unknown')
      expect(status.text).toEqual('')
    })
  })
  describe('checkoutButtonLimitsHelper', () => {
    it('should return false', () => {
      const result = CoinifyService.checkoutButtonLimitsHelper(
        Remote.of(baseFiatQuote),
        correctLimits,
        'buy'
      )
      expect(result).toEqual(false)
    })
    it('should return false for a baseBtc quote', () => {
      const result = CoinifyService.checkoutButtonLimitsHelper(
        Remote.of(baseBtcQuote),
        correctLimits,
        'buy'
      )
      expect(result).toEqual(false)
    })
  })
})
