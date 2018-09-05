import PropTypes from 'prop-types'

export const USER_ACTIVATION_STATES = {
  NOT_CREATED: 'NOT_CREATED',
  CREATED: 'CREATED',
  ACTIVE: 'ACTIVE',
  BLOCKED: 'BLOCKED'
}

export const KYC_STATES = {
  NONE: 'NONE',
  PENDING: 'PENDING',
  REJECTED: 'REJECTED',
  VERIFIED: 'VERIFIED',
  EXPIRED: 'EXPIRED'
}

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
