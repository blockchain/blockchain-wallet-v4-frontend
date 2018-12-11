import React from 'react'
import { path, prop, propEq } from 'ramda'
import { FormattedMessage } from 'react-intl'

export const TIERS = {
  1: {
    amount: '$1,000',
    time: '3',
    isActive: propEq('state', 'ACTIVE'),
    limit: {
      type: 'annual',
      message: (
        <FormattedMessage
          id='components.identityverification.tiercard.annuallimit'
          defaultMessage='Annual Swap Limit'
        />
      )
    },
    requirements: [
      {
        message: (
          <FormattedMessage
            id='components.identityverification.tiercard.email'
            defaultMessage='Verified Email'
          />
        ),
        complete: prop('email')
      },
      {
        message: (
          <FormattedMessage
            id='components.identityverification.tiercard.name'
            defaultMessage='Name'
          />
        ),
        complete: userData =>
          prop('firstName', userData) && prop('lastName', userData)
      },
      {
        message: (
          <FormattedMessage
            id='components.identityverification.tiercard.dob'
            defaultMessage='Date of Birth'
          />
        ),
        complete: prop('dob')
      },
      {
        message: (
          <FormattedMessage
            id='components.identityverification.tiercard.address'
            defaultMessage='Address'
          />
        ),
        complete: userData =>
          path(['address', 'city'], userData) &&
          path(['address', 'country'], userData) &&
          path(['address', 'line1'], userData)
      }
    ]
  },
  2: {
    amount: '$25,000',
    time: '10',
    isActive: propEq('kycState', 'VERIFIED'),
    limit: {
      type: 'daily',
      message: (
        <FormattedMessage
          id='components.identityverification.tiercard.dailylimit'
          defaultMessage='Daily Swap Limit'
        />
      )
    },
    requirements: [
      {
        message: (
          <FormattedMessage
            id='components.identityverification.tiercard.tier1'
            defaultMessage='Tier 1+'
          />
        ),
        complete: () => false
      },
      {
        message: (
          <FormattedMessage
            id='components.identityverification.tiercard.phone'
            defaultMessage='Verified Phone'
          />
        ),
        complete: prop('mobileVerified')
      },
      {
        message: (
          <FormattedMessage
            id='components.identityverification.tiercard.id'
            defaultMessage="Gov't Issued ID"
          />
        ),
        complete: userData => prop('kycState', userData) !== 'NONE'
      },
      {
        message: (
          <FormattedMessage
            id='components.identityverification.tiercard.selfie'
            defaultMessage='Selfie'
          />
        ),
        complete: userData => prop('kycState', userData) !== 'NONE'
      }
    ]
  }
}
