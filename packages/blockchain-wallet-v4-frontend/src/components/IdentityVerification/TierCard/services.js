import React from 'react'
import { FormattedMessage } from 'react-intl'
import { or, path, prop, propEq } from 'ramda'

import { Text } from 'blockchain-info-components'

export const headers = {
  SILVER: (
    <FormattedMessage
      id='components.identityverification.tiercard.silver'
      defaultMessage='Silver Level'
    />
  ),
  GOLD: (
    <FormattedMessage
      id='components.identityverification.tiercard.gold'
      defaultMessage='Gold Level'
    />
  )
}

export const levelName = {
  SILVER: (
    <FormattedMessage
      id='components.identityverification.tiercard.silverlevelname'
      defaultMessage='Silver'
    />
  ),
  GOLD: (
    <FormattedMessage
      id='components.identityverification.tiercard.goldlevelname'
      defaultMessage='Gold'
    />
  )
}

export const messages = {
  EMAIL: (
    <Text size='12px'>
      <FormattedMessage
        id='components.identityverification.tiercard.email'
        defaultMessage='Verified Email'
      />
    </Text>
  ),
  NAME: (
    <Text size='12px'>
      <FormattedMessage
        id='components.identityverification.tiercard.name'
        defaultMessage='Name'
      />
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
  ADDRESS: (
    <Text size='12px'>
      <FormattedMessage id='copy.address' defaultMessage='Address' />
    </Text>
  ),
  TIER1: (
    <Text size='12px'>
      <FormattedMessage
        id='components.identityverification.tiercard.silverplus'
        defaultMessage='Silver Level +'
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
  SELFIE: (
    <Text size='12px' style={{ marginBottom: '26px', display: 'inline-block' }}>
      <FormattedMessage
        id='components.identityverification.tiercard.portraitphoto'
        defaultMessage='Portrait Photo'
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
        if (
          or(
            propEq('state', 'none', nextTier),
            propEq('state', 'pending', nextTier)
          )
        ) {
          return (
            <Text size='14px' color='btc'>
              <FormattedMessage
                id='copy.in_review'
                defaultMessage='In Review'
              />
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
  SILVER: (
    <span data-e2e='unlockSilverBtn'>
      <FormattedMessage
        id='components.identityverification.tiercard.silvercta'
        defaultMessage='Unlock Silver'
      />
    </span>
  ),
  GOLD: (
    <span data-e2e='unlockGoldBtn'>
      <FormattedMessage
        id='components.identityverification.tiercard.goldctamedal'
        defaultMessage='Unlock Gold 🥇'
      />
    </span>
  )
}
