import React, { useState } from 'react'
import { ComponentMeta } from '@storybook/react'

import { Tab, Tabs, TabsComponent } from '.'

const tabsStoriesMeta: ComponentMeta<TabsComponent> = {
  component: Tabs,
  subcomponents: {
    Tab
  },
  title: 'Components/Tabs'
}

export const Default = () => {
  const [selectedTab, setSelectedTab] = useState<
    'all' | 'live' | 'last_day' | 'last_week' | 'last_month' | 'last_year'
  >('live')

  return (
    <Tabs>
      <Tab
        badgeColor='green'
        onClick={() => setSelectedTab('live')}
        selected={selectedTab === 'live'}
      >
        Live
      </Tab>

      <Tab onClick={() => setSelectedTab('last_day')} selected={selectedTab === 'last_day'}>
        1D
      </Tab>

      <Tab onClick={() => setSelectedTab('last_week')} selected={selectedTab === 'last_week'}>
        1W
      </Tab>

      <Tab onClick={() => setSelectedTab('last_month')} selected={selectedTab === 'last_month'}>
        1M
      </Tab>

      <Tab onClick={() => setSelectedTab('last_year')} selected={selectedTab === 'last_year'}>
        1Y
      </Tab>

      <Tab onClick={() => setSelectedTab('all')} selected={selectedTab === 'all'}>
        All
      </Tab>
    </Tabs>
  )
}

export default tabsStoriesMeta
