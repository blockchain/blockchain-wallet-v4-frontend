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
          defaultMessage='Deposit crypto and earn up to {maxPercentage}%.'
          id='modals.onboarding.earn.onboarding.description-maxpercentage'
          values={{ maxPercentage }}
        />
      ) : (
        <FormattedMessage
          defaultMessage='Deposit crypto and start earning'
          id='modals.onboarding.earn.onboarding.description'
        />
      ),
      image: 'onboarding-earn',
      title: (
        <FormattedMessage
          defaultMessage='Welcome to Earn'
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
    isActiveRewards: true,
    link: '/earn/active-rewards-learn',
    title: (
      <FormattedMessage
        defaultMessage='Get rewarded by forecasting the market'
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
    link: 'https://support.blockchain.com/hc/en-us/sections/4416668318740-Rewards',
    title: (
      <FormattedMessage
        defaultMessage='Earn passive rewards on your crypto'
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
    link: 'https://support.blockchain.com/hc/en-us/sections/5954708914460-Staking',
    title: (
      <FormattedMessage
        defaultMessage='Unlock the power of staking'
        id='modals.onboarding.earn.onboarding.stakingtitle'
      />
    )
  }

  if (isPassiveEligible) contents.push(passiveContent)
  if (isStakingEligible) contents.push(stakingContent)
  if (isActiveEligible) contents.push(activeContent)

  return contents
}
