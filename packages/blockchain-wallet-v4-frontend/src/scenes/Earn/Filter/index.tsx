import React from 'react'

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

  return isMobile ? (
    <MobileFilter
      earnTab={earnTab}
      handleAssetClick={handleAssetClick}
      handleHistoryClick={handleHistoryClick}
      handleSearch={handleSearch}
      handleTabClick={handleTabClick}
      showAvailableAssets={showAvailableAssets}
    />
  ) : (
    <Filter
      earnTab={earnTab}
      handleAssetClick={handleAssetClick}
      handleHistoryClick={handleHistoryClick}
      handleSearch={handleSearch}
      handleTabClick={handleTabClick}
      showAvailableAssets={showAvailableAssets}
    />
  )
}

export default EarnFilterContainer
