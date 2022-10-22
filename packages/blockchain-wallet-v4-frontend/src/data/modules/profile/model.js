import PropTypes from 'prop-types'
import { complement, findLast, propEq } from 'ramda'

export const USER_ACTIVATION_STATES = {
  ACTIVE: 'ACTIVE',
  BLOCKED: 'BLOCKED',
  CREATED: 'CREATED',
  NONE: 'NONE'
}

export const KYC_STATES = {
  EXPIRED: 'EXPIRED',
  NONE: 'NONE',
  PENDING: 'PENDING',
  REJECTED: 'REJECTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  VERIFIED: 'VERIFIED'
}

export const TIERS_STATES = {
  EXPIRED: 'expired',
  NONE: 'none',
  PENDING: 'pending',
  REJECTED: 'rejected',
  UNDER_REVIEW: 'under_review',
  VERIFIED: 'verified'
}

export const DOC_RESUBMISSION_REASONS = {
  EXPIRED: 1,
  GENERAL: 0
}

export const ERROR_TYPES = {
  BAD_2FA: 'BAD_2FA'
}

export const TIERS = {
  0: 0,
  1: 1,
  2: 2
}

export const INITIAL_TIERS = [
  { index: 0, limits: null, name: 'Tier 0', state: 'none' },
  {
    index: 1,
    limits: { annual: 1000.0, currency: 'USD', daily: null, type: 'CRYPTO' },
    name: 'Tier 1',
    state: 'none'
  },
  {
    index: 2,
    limits: { annual: null, currency: 'USD', daily: 25000.0, type: 'CRYPTO' },
    name: 'Tier 2',
    state: 'none'
  }
]

export const AddressPropType = PropTypes.shape({
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  line1: PropTypes.string.isRequired,
  line2: PropTypes.string,
  postCode: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired
})

export const CountryPropType = PropTypes.shape({
  code: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  regions: PropTypes.arrayOf(PropTypes.string),
  scopes: PropTypes.arrayOf(PropTypes.string)
})

export const getLastAttemptedTier = findLast(complement(propEq('state', TIERS_STATES.NONE)))

export const getLastUnrejectedTier = findLast(complement(propEq('state', TIERS_STATES.REJECTED)))

export const getLastVerifiedTier = findLast(propEq('state', TIERS_STATES.VERIFIED))

export const WITHDRAW_LOCK_DEFAULT_DAYS = 3

export const X_SESSION_ID = 'xSessionId'
