import { ReactNode } from 'react'

export type LearnColumnType = {
  description: ReactNode
  icon: ReactNode
  id: string
  isActiveRewards?: boolean
  link?: string
  title: ReactNode
}
