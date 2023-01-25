import { EarnTabsType } from 'data/types'

export type TabsPropsType = {
  earnTab: EarnTabsType
  handleTabClick: (tab: EarnTabsType) => void
}

export type TabType = {
  key: string | EarnTabsType
  titleContent: JSX.Element
}
