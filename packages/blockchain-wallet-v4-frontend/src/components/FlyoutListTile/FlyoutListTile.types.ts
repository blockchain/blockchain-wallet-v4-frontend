import { FC, ReactNode } from 'react'

export type FlyoutListTileProps = {
  disabled?: boolean
  icon: ReactNode
  iconColor: string
  onClick: () => void
  subtitle: ReactNode
  title: ReactNode
}

export type FlyoutListTileComponent = FC<FlyoutListTileProps>
