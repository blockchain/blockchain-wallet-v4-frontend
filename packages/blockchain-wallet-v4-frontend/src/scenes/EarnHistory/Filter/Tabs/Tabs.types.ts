import { EarnTabsType } from 'data/types'

export type TabsProps = {
  earnTab: EarnTabsType
  handleTabClick: (tab: EarnTabsType) => void
}
