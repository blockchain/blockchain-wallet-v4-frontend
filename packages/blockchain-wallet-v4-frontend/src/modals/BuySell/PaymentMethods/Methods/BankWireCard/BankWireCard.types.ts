import { FC, ReactElement } from 'react'

import { BSPaymentMethodType } from '@core/types'

export type BankWireCardProps = {
  onClick: (string) => void
  text: ReactElement | string
  value: BSPaymentMethodType
}

export type BankWireCardComponent = FC<BankWireCardProps>
