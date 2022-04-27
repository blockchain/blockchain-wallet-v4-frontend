import { FC, ReactNode } from 'react'

export type FlyoutListItemProps = {
  children?: never
  endIcon?: ReactNode
  icon: ReactNode
  onClick?: () => null
  subtitle?: ReactNode
  title: ReactNode
}

export type FlyoutListItemComponent = FC<FlyoutListItemProps>
