import React from 'react'
import { FormattedMessage } from 'react-intl'
import { or, path, prop, propEq } from 'ramda'

import { Text } from 'blockchain-info-components'

export const headers = {
  GOLD: (
    <FormattedMessage
      id='components.identityverification.tiercard.full_access'
      defaultMessage='Full Access Level'
    />
  ),
  SILVER: (
    <FormattedMessage
      id='components.identityverification.tiercard.limited_access'
      defaultMessage='Limited Access Level'
    />
  )
}

export const levelName = {
  GOLD: (
    <FormattedMessage
      id='components.identityverification.tiercard.full_access_levelname'
      defaultMessage='Full Access'
    />
  ),
  SILVER: (
    <FormattedMessage
      id='components.identityverification.tiercard.limit_access_levelname'
      defaultMessage='Limited Access'
    />
  )
}

export const messages = {
  ADDRESS: (
    <Text size='12px'>
      <FormattedMessage id='copy.address' defaultMessage='Address' />
    </Text>
  ),
  DOB: (
    <Text size='12px'>
      <FormattedMessage
        id='components.identityverification.tiercard.dob'
        defaultMessage='Date of Birth'
      />
    </Text>
  ),
  EMAIL: (
    <Text size='12px'>
      <FormattedMessage
        id='components.identityverification.tiercard.email'
        defaultMessage='Verified Email'
      />
    </Text>
  ),
  GOVID: (
    <Text size='12px'>
      <FormattedMessage
        id='components.identityverification.tiercard.id'
        defaultMessage="Gov't Issued ID"
      />
    </Text>
  ),
  NAME: (
    <Text size='12px'>
      <FormattedMessage id='components.identityverification.tiercard.name' defaultMessage='Name' />
    </Text>
  ),
  SELFIE: (
    <Text size='12px' style={{ display: 'inline-block', marginBottom: '26px' }}>
      <FormattedMessage
        id='components.identityverification.tiercard.portraitphoto'
        defaultMessage='Portrait Photo'
      />
    </Text>
  ),
  TIER1: (
    <Text size='12px'>
      <FormattedMessage
        id='components.identityverification.tiercard.limited_access'
        defaultMessage='Limited Access Level'
      />
    </Text>
  )
}

export const limits = {
  ANNUAL: (
    <Text size='14px'>
      <FormattedMessage
        id='components.identityverification.tiercard.annualtradinglimit'
        defaultMessage='Annual Trading Limit'
      />
    </Text>
  ),
  DAILY: (
    <Text size='14px'>
      <FormattedMessage
        id='components.identityverification.tiercard.dailytradinglimit'
        defaultMessage='Daily Trading Limit'
      />
    </Text>
  )
}

export const status = (tier, userTiers, time) => {
  const state = path([tier - 1, 'state'], userTiers)
  const nextTier = prop(tier, userTiers)
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
          <FormattedMessage id='copy.in_review' defaultMessage='In Review' />
        </Text>
      )
    case 'rejected':
      if (nextTier) {
        if (or(propEq('state', 'none', nextTier), propEq('state', 'pending', nextTier))) {
          return (
            <Text size='14px' color='btc'>
              <FormattedMessage id='copy.in_review' defaultMessage='In Review' />
            </Text>
          )
        }
        if (propEq('state', 'verified', nextTier)) {
          return (
            <Text size='14px' color='success'>
              <FormattedMessage
                id='components.identityverification.tiercard.verified'
                defaultMessage='Approved!'
              />
            </Text>
          )
        }
      }
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
          values={{ time }}
        />
      )
  }
}

export const ctas = {
  GOLD: (
    <span data-e2e='unlockGoldBtn'>
      <FormattedMessage
        id='components.identityverification.tiercard.full_access_ctamedal'
        defaultMessage='Unlock Full Access 🥇'
      />
    </span>
  ),
  SILVER: (
    <span data-e2e='unlockSilverBtn'>
      <FormattedMessage
        id='components.identityverification.tiercard.limited_access_cta'
        defaultMessage='Unlock Limited Access'
      />
    </span>
  )
}
