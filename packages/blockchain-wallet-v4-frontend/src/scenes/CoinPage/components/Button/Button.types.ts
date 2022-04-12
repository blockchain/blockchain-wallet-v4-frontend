import { FC, ReactNode } from 'react'

import { Button } from 'blockchain-info-components'

type T = typeof Button

export type ButtonProps = {
  'data-e2e': string
  disabled?: boolean
  icon?: ReactNode
  nature: 'dark-grey' | 'primary'
  onClick?: () => void
}

export type ButtonComponent = FC<ButtonProps>
