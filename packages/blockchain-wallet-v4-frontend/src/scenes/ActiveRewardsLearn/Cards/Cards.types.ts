import { ReactNode } from 'react'

export type CardType = {
  description: ReactNode
  id: string
  title: ReactNode
}

export type CardContainerType = {
  isFullWidth?: boolean
}
