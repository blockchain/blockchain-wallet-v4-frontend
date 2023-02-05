import React from 'react'
import { FormattedMessage } from 'react-intl'
import { IconLockClosed, IconRewardsCircle, SemanticColors } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { Image } from 'blockchain-info-components'

import { LearnColumnArgTypes, LearnColumnType } from './Learn.types'

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: space-between;
  background-color: ${SemanticColors['background-light']};
  padding: 24px;
  border-radius: 8px;
  margin-top: 12px;
  margin-bottom: 24px;

  a {
    padding: 0 !important;
    width: fit-content;
    text-decoration: none !important;
  }

  & > div {
    min-height: 116px;
  }
`

export const learnColumns = ({
  handleActiveRewards,
  handleCompareClick
}: LearnColumnArgTypes): LearnColumnType[] => [
  {
    description: (
      <FormattedMessage
        id='scenes.earn.learn.rewards.description'
        defaultMessage='Monthly rewards for holding crypto with us. For eligible users.'
      />
    ),
    icon: <IconRewardsCircle color={SemanticColors.primary} size='medium' />,
    id: 'scenes.earn.learn.rewards.description',
    link: 'https://support.blockchain.com/hc/en-us/sections/4416668318740-Rewards',
    title: <FormattedMessage id='copy.passive-rewards' defaultMessage='Passive Rewards' />
  },
  {
    description: (
      <FormattedMessage
        id='scenes.earn.learn.staking.description'
        defaultMessage='Daily rewards for securing blockchain networks. For intermediate users.'
      />
    ),
    icon: <IconLockClosed color={SemanticColors.primary} size='medium' />,
    id: 'scenes.earn.learn.staking.description',
    link: 'https://support.blockchain.com/hc/en-us/sections/5954708914460-Staking',
    title: <FormattedMessage id='copy.staking-rewards' defaultMessage='Staking Rewards' />
  },
  {
    description: (
      <FormattedMessage
        id='scenes.earn.learn.active-rewards.description'
        defaultMessage='Weekly rewards for forecasting the market. For advanced users.'
      />
    ),
    handleClick: handleActiveRewards,
    icon: <Image name='bars' width='20px' height='24px' />,
    id: 'scenes.earn.learn.active-rewards.description',
    isActiveRewards: true,
    link: '/earn/active-rewards-learn',
    title: <FormattedMessage id='copy.active-rewards' defaultMessage='Active Rewards' />
  },
  {
    description: (
      <FormattedMessage
        id='scenes.earn.learn.compare-products.description'
        defaultMessage='Compare Earn products to see what suits you best.'
      />
    ),
    handleClick: handleCompareClick,
    id: 'scenes.earn.learn.compare-products.description',
    title: (
      <FormattedMessage id='scenes.earn.learn.compare-products' defaultMessage='Compare products' />
    )
  }
]
