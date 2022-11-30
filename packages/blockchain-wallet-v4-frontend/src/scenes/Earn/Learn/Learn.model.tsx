import React from 'react'
import { FormattedMessage } from 'react-intl'
import {
  IconLockClosed,
  IconMarketUp,
  IconRewardsCircle,
  SemanticColors,
  Text
} from '@blockchain-com/constellation'
import styled from 'styled-components'

import { LearnColumnType } from './Learn.types'

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: space-between;
  background-color: ${SemanticColors['background-light']};
  padding: 24px;
  border-radius: 8px;
  margin-top: 12px;

  a {
    padding: 0 !important;
    text-decoration: none !important;
  }

  & > div {
    min-height: 116px;
  }
`

export const VerticalLine = styled.div`
  height: 32px;
  width: 1px;
  background-color: ${SemanticColors.medium};
`

export const learnColumn: LearnColumnType[] = [
  {
    description: (
      <Text color={SemanticColors.title} variant='paragraph1'>
        <FormattedMessage
          id='scenes.earn.learn.rewards.description'
          defaultMessage='Monthly rewards for holding crypto with us. For eligible users.'
        />
      </Text>
    ),
    icon: <IconRewardsCircle color={SemanticColors.primary} size='medium' />,
    link: 'https://support.blockchain.com/hc/en-us/sections/4416668318740-Rewards',
    title: (
      <Text color={SemanticColors.body}>
        <FormattedMessage id='copy.rewards' defaultMessage='Rewards' />
      </Text>
    )
  },
  {
    description: (
      <Text color={SemanticColors.title} variant='paragraph1'>
        <FormattedMessage
          id='scenes.earn.learn.staking.description'
          defaultMessage='Daily rewards for securing blockchain networks. For intermediate users.'
        />
      </Text>
    ),
    icon: <IconLockClosed color={SemanticColors.primary} size='medium' />,
    link: 'https://support.blockchain.com/hc/en-us/sections/5954708914460-Staking',
    title: (
      <Text color={SemanticColors.body}>
        <FormattedMessage id='copy.staking' defaultMessage='Staking' />
      </Text>
    )
  },
  {
    description: (
      <Text color={SemanticColors.title} variant='paragraph1'>
        <FormattedMessage
          id='scenes.earn.learn.active-rewards.description'
          defaultMessage='Weekly rewards for forecasting the market. For advanced users.'
        />
      </Text>
    ),
    icon: <IconMarketUp color={SemanticColors.primary} size='medium' />,
    isActiveRewards: true,
    link: '/earn/active-rewards-learn',
    title: (
      <Text color={SemanticColors.body}>
        <FormattedMessage id='copy.active-rewards' defaultMessage='Active Rewards' />
      </Text>
    )
  }
]
