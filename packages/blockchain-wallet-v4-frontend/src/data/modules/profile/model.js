import PropTypes from 'prop-types'
import { complement, findLast, propEq } from 'ramda'

export const USER_ACTIVATION_STATES = {
  NONE: 'NONE',
  CREATED: 'CREATED',
  ACTIVE: 'ACTIVE',
  BLOCKED: 'BLOCKED'
}

export const KYC_STATES = {
  NONE: 'NONE',
  PENDING: 'PENDING',
  UNDER_REVIEW: 'UNDER_REVIEW',
  REJECTED: 'REJECTED',
  VERIFIED: 'VERIFIED',
  EXPIRED: 'EXPIRED'
}

export const TIERS_STATES = {
  NONE: 'none',
  PENDING: 'pending',
  UNDER_REVIEW: 'under_review',
  REJECTED: 'rejected',
  VERIFIED: 'verified',
  EXPIRED: 'expired'
}

export const DOC_RESUBMISSION_REASONS = {
  GENERAL: 0,
  EXPIRED: 1
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
  { index: 0, name: 'Tier 0', state: 'none', limits: null },
  {
    index: 1,
    name: 'Tier 1',
    state: 'none',
    limits: { type: 'CRYPTO', currency: 'USD', daily: null, annual: 1000.0 }
  },
  {
    index: 2,
    name: 'Tier 2',
    state: 'none',
    limits: { type: 'CRYPTO', currency: 'USD', daily: 25000.0, annual: null }
  }
]

export const AddressPropType = PropTypes.shape({
  city: PropTypes.string.isRequired,
  line1: PropTypes.string.isRequired,
  line2: PropTypes.string,
  state: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  postCode: PropTypes.string.isRequired
})

export const CountryPropType = PropTypes.shape({
  code: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  regions: PropTypes.arrayOf(PropTypes.string),
  scopes: PropTypes.arrayOf(PropTypes.string)
})

export const getLastAttemptedTier = findLast(
  complement(propEq('state', TIERS_STATES.NONE))
)

export const getLastUnrejectedTier = findLast(
  complement(propEq('state', TIERS_STATES.REJECTED))
)

export const getLastVerifiedTier = findLast(
  propEq('state', TIERS_STATES.VERIFIED)
)

export const WITHDRAW_LOCK_DEFAULT_DAYS = 3
