import React from 'react'
import { useSelector } from 'react-redux'

import { selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { useMedia } from 'services/styles'

import MobileFilter from './Filter.mobile.template'
import { getTabs } from './Filter.model'
import Filter from './Filter.template'
import { EarnFilterPropsType } from './Filter.types'

const EarnFilterContainer = ({
  earnTab,
  handleAssetClick,
  handleHistoryClick,
  handleSearch,
  handleTabClick,
  showAvailableAssets
}: EarnFilterPropsType) => {
  const isTabletL = useMedia('tabletL')
  const isActiveRewardsEnabled = useSelector(
    (state: RootState) =>
      selectors.core.walletOptions.getActiveRewardsEnabled(state).getOrElse(false) as boolean
  )
  const showAvailableAssetsEnabled = useSelector(
    (state: RootState) =>
      selectors.core.walletOptions.getShowEarnAvailableAssets(state).getOrElse(false) as boolean
  )
  const tabs = getTabs(isActiveRewardsEnabled)

  return isTabletL ? (
    <MobileFilter
      earnTab={earnTab}
      handleAssetClick={handleAssetClick}
      handleHistoryClick={handleHistoryClick}
      handleSearch={handleSearch}
      handleTabClick={handleTabClick}
      showAvailableAssets={showAvailableAssets}
      showAvailableAssetsEnabled={showAvailableAssetsEnabled}
      tabs={tabs}
    />
  ) : (
    <Filter
      earnTab={earnTab}
      handleAssetClick={handleAssetClick}
      handleHistoryClick={handleHistoryClick}
      handleSearch={handleSearch}
      handleTabClick={handleTabClick}
      showAvailableAssets={showAvailableAssets}
      showAvailableAssetsEnabled={showAvailableAssetsEnabled}
      tabs={tabs}
    />
  )
}

export default EarnFilterContainer
