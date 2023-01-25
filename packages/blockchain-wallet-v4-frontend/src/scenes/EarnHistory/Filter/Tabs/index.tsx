import React from 'react'
import { useSelector } from 'react-redux'
import { Tabs } from '@blockchain-com/constellation'

import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { getTabs } from './Tabs.model'
import { TabsPropsType, TabType } from './Tabs.types'

const Tab = ({ earnTab, handleTabClick }: TabsPropsType) => {
  const isActiveRewardsEnabled = useSelector(
    (state: RootState) =>
      selectors.core.walletOptions.getActiveRewardsEnabled(state).getOrElse(false) as boolean
  )
  const tabs: TabType[] = getTabs(isActiveRewardsEnabled)

  return (
    <Tabs
      defaultActiveTab={earnTab}
      onTabChange={handleTabClick}
      size='large'
      tabs={tabs}
      variant='default'
    />
  )
}

export default Tab
