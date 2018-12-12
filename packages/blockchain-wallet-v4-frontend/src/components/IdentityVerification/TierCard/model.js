import React from 'react'
import { path, prop, propEq } from 'ramda'
import { FormattedMessage } from 'react-intl'
import { Text } from 'blockchain-info-components'

export const getTiming = (state, tier) => {
  switch (state) {
    case 'verified':
      return (
        <Text size='14px' color='success'>
          <FormattedMessage
            id='components.identityverification.tiercard.verified'
            defaultMessage='Approved!'
          />
        </Text>
      )
    case 'pending':
      return (
        <Text size='14px' color='btc'>
          <FormattedMessage
            id='components.identityverification.tiercard.pending'
            defaultMessage='In Review'
          />
        </Text>
      )
    case 'rejected':
      return (
        <Text size='14px' color='error'>
          <FormattedMessage
            id='components.identityverification.tiercard.rejected'
            defaultMessage='Rejected'
          />
        </Text>
      )
    default:
      return (
        <FormattedMessage
          id='components.identityverification.tiercard.timing'
          defaultMessage='Takes {time} min'
          values={{ time: path([tier, 'time'], TIERS) }}
        />
      )
  }
}

export const TIERS = {
  1: {
    time: '3',
    isActive: propEq('state', 'ACTIVE'),
    limit: {
      type: 'annual',
      message: (
        <Text size='14px'>
          <FormattedMessage
            id='components.identityverification.tiercard.annuallimit'
            defaultMessage='Annual Swap Limit'
          />
        </Text>
      )
    },
    requirements: [
      {
        message: (
          <Text size='14px'>
            <FormattedMessage
              id='components.identityverification.tiercard.email'
              defaultMessage='Verified Email'
            />
          </Text>
        ),
        complete: prop('email')
      },
      {
        message: (
          <Text size='14px'>
            <FormattedMessage
              id='components.identityverification.tiercard.name'
              defaultMessage='Name'
            />
          </Text>
        ),
        complete: userData =>
          prop('firstName', userData) && prop('lastName', userData)
      },
      {
        message: (
          <Text size='14px'>
            <FormattedMessage
              id='components.identityverification.tiercard.dob'
              defaultMessage='Date of Birth'
            />
          </Text>
        ),
        complete: prop('dob')
      },
      {
        message: (
          <Text size='14px'>
            <FormattedMessage
              id='components.identityverification.tiercard.address'
              defaultMessage='Address'
            />
          </Text>
        ),
        complete: userData =>
          path(['address', 'city'], userData) &&
          path(['address', 'country'], userData) &&
          path(['address', 'line1'], userData)
      }
    ]
  },
  2: {
    time: '10',
    isActive: propEq('kycState', 'VERIFIED'),
    limit: {
      type: 'daily',
      message: (
        <Text size='14px'>
          <FormattedMessage
            id='components.identityverification.tiercard.dailylimit'
            defaultMessage='Daily Swap Limit'
          />
        </Text>
      )
    },
    requirements: [
      {
        message: (
          <Text size='14px' color='gray-3'>
            <FormattedMessage
              id='components.identityverification.tiercard.tier1'
              defaultMessage='Tier 1+'
            />
          </Text>
        ),
        complete: (userData, tiersData) => tiersData[1].state === 'verified'
      },
      {
        message: (
          <Text size='14px'>
            <FormattedMessage
              id='components.identityverification.tiercard.phone'
              defaultMessage='Verified Phone'
            />
          </Text>
        ),
        complete: prop('mobileVerified')
      },
      {
        message: (
          <Text size='14px'>
            <FormattedMessage
              id='components.identityverification.tiercard.id'
              defaultMessage="Gov't Issued ID"
            />
          </Text>
        ),
        complete: userData => prop('kycState', userData) !== 'NONE'
      },
      {
        message: (
          <Text size='14px'>
            <FormattedMessage
              id='components.identityverification.tiercard.selfie'
              defaultMessage='Selfie'
            />
          </Text>
        ),
        complete: userData => prop('kycState', userData) !== 'NONE'
      }
    ]
  }
}
