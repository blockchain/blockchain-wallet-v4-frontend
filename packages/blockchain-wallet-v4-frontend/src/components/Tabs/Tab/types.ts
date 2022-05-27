import { FC } from 'react'

export type TabProps = {
  badgeColor?: 'green'
  onClick?: () => void
  selected?: boolean
}

export type TabComponent = FC<TabProps>
