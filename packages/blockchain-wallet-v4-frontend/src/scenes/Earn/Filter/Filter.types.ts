import { ChangeEvent } from 'react'

import { EarnTabsType } from 'data/types'

export type TabType = {
  key: string | EarnTabsType
  titleContent: JSX.Element
}

export type EarnFilterPropsType = {
  earnTab: EarnTabsType
  handleAssetClick: (status: boolean) => void
  handleHistoryClick: () => void
  handleSearch: (e: ChangeEvent<HTMLInputElement>) => void
  handleTabClick: (tab: string) => void
  showAvailableAssets: boolean
}

export type FilterPropsType = {
  showAvailableAssetsEnabled: boolean
  tabs: TabType[]
} & EarnFilterPropsType
