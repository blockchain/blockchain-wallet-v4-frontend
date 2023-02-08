import { ReactNode } from 'react'

export type LearnColumnArgTypes = {
  handleActiveRewards: () => void
  handleCompareClick: () => void
}

export type LearnColumnType = {
  description: ReactNode
  handleClick?: () => void
  icon?: ReactNode
  id: string
  isActiveRewards?: boolean
  link?: string
  title: ReactNode
}
