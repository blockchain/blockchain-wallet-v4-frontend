import { FC, ReactNode } from 'react'

export type ButtonProps = {
  'data-e2e': string
  disabled?: boolean
  icon?: ReactNode
  nature: 'dark-grey' | 'primary'
  onClick?: () => void
}

export type ButtonComponent = FC<ButtonProps>
