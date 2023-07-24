import React from 'react'
import { FormattedMessage } from 'react-intl'

import { SlidePropsType } from './Earn.types'

export const getSlides = ({
  isActiveEligible,
  isPassiveEligible,
  isStakingEligible,
  maxPercentage
}): SlidePropsType[] => {
  const contents: SlidePropsType[] = [
    {
      description: maxPercentage ? (
        <FormattedMessage
          defaultMessage='Get the most out of your crypto. Deposit and earn up to {maxPercentage}%.'
          id='modals.onboarding.earn.onboarding.description-maxpercentage'
          values={{ maxPercentage }}
        />
      ) : (
        <FormattedMessage
          defaultMessage='Get the most out of your crypto. Deposit crypto and start earning'
          id='modals.onboarding.earn.onboarding.description'
        />
      ),
      image: 'onboarding-earn',
      title: (
        <FormattedMessage
          defaultMessage='A new way to Earn'
          id='modals.onboarding.earn.onboarding.title'
        />
      )
    }
  ]

  const activeContent: SlidePropsType = {
    description: (
      <FormattedMessage
        defaultMessage='Participate on weekly strategies and earn rewards based on crypto performance.'
        id='modals.onboarding.earn.onboarding.active.description'
      />
    ),
    image: 'onboarding-active-rewards',
    title: (
      <FormattedMessage
        defaultMessage='Active Rewards'
        id='modals.onboarding.earn.onboarding.active.title'
      />
    )
  }

  const passiveContent: SlidePropsType = {
    description: (
      <FormattedMessage
        defaultMessage='Get paid every month, just for holding.'
        id='modals.onboarding.earn.onboarding.passive.description'
      />
    ),
    image: 'onboarding-passive-rewards',
    title: (
      <FormattedMessage
        defaultMessage='Passive Rewards'
        id='modals.onboarding.earn.onboarding.passive.title'
      />
    )
  }

  const stakingContent: SlidePropsType = {
    description: (
      <FormattedMessage
        defaultMessage='Earn crypto for securing your favorite blockchain networks.'
        id='modals.onboarding.earn.onboarding.staking.description'
      />
    ),
    image: 'onboarding-staking-rewards',
    title: (
      <FormattedMessage
        defaultMessage='Staking Rewards'
        id='modals.onboarding.earn.onboarding.stakingtitle'
      />
    )
  }

  if (isPassiveEligible) contents.push(passiveContent)
  if (isStakingEligible) contents.push(stakingContent)
  if (isActiveEligible) contents.push(activeContent)

  return contents
}
