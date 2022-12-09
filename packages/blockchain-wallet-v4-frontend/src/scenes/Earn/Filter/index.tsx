import React from 'react'
import { useSelector } from 'react-redux'

import { selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { useMedia } from 'services/styles'

import MobileFilter from './Filter.mobile.template'
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
  const isMobile = useMedia('mobile')
  const showAvailableAssetsEnabled = useSelector(
    (state: RootState) =>
      selectors.core.walletOptions.getShowEarnAvailableAssets(state).getOrElse(false) as boolean
  )

  return isMobile ? (
    <MobileFilter
      earnTab={earnTab}
      handleAssetClick={handleAssetClick}
      handleHistoryClick={handleHistoryClick}
      handleSearch={handleSearch}
      handleTabClick={handleTabClick}
      showAvailableAssets={showAvailableAssets}
      showAvailableAssetsEnabled={showAvailableAssetsEnabled}
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
    />
  )
}

export default EarnFilterContainer
