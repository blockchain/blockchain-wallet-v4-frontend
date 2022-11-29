import { ReactNode } from 'react'

export type LearnColumnType = {
  description: ReactNode
  icon: ReactNode
  isActiveRewards?: boolean
  link?: string
  title: ReactNode
}
