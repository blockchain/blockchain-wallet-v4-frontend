import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Tabs } from '@blockchain-com/constellation'

import { TextContainer } from './Tabs.model'
import { TabsProps } from './Tabs.types'

const Tab = ({ earnTab, handleTabClick }: TabsProps) => (
  <Tabs
    defaultActiveTab={earnTab}
    // @ts-ignore
    onTabChange={handleTabClick}
    size='large'
    tabs={[
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
      },
      {
        key: 'Active',
        titleContent: (
          <TextContainer>
            <FormattedMessage id='copy.active' defaultMessage='Active' />
          </TextContainer>
        )
      }
    ]}
    variant='default'
  />
)

export default Tab
