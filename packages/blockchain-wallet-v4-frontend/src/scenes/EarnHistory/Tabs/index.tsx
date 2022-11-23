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
            <FormattedMessage
              id='scenes.earnhistory.tabs.allproducts'
              defaultMessage='All Products'
            />
          </TextContainer>
        )
      },
      {
        key: 'Rewards',
        titleContent: (
          <TextContainer>
            <FormattedMessage id='copy.rewards' defaultMessage='Rewards' />
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
    ]}
    variant='default'
  />
)

export default Tab
