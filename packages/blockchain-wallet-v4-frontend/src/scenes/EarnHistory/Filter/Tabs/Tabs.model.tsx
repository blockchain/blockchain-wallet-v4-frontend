import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { media } from 'services/styles'

import { TabType } from './Tabs.types'

const TextContainer = styled.div`
  min-width: 85px;
  padding: 2px 0;

  ${media.laptop`
    min-width:60px;
  `};
`

export const getTabs = (isActiveRewardsEnabled: boolean): TabType[] => {
  const tabs = [
    {
      key: 'All',
      titleContent: (
        <TextContainer>
          <FormattedMessage id='scenes.earn.filter.all-rewards' defaultMessage='All Rewards' />
        </TextContainer>
      )
    },
    {
      key: 'Passive',
      titleContent: (
        <TextContainer>
          <FormattedMessage id='copy.Passive' defaultMessage='Passive' />
        </TextContainer>
      )
    },
    {
      key: 'Staking',
      titleContent: (
        <TextContainer>
          <FormattedMessage id='copy.staking' defaultMessage='Staking' />
        </TextContainer>
      )
    }
  ]
  const activeRewardsTab = {
    key: 'Active',
    titleContent: (
      <TextContainer>
        <FormattedMessage id='copy.active' defaultMessage='Active' />
      </TextContainer>
    )
  }

  return isActiveRewardsEnabled ? [...tabs, activeRewardsTab] : tabs
}
