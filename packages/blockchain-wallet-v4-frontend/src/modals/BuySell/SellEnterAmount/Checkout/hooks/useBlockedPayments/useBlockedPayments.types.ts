import { ReactNode } from 'react'

import { BSPaymentMethodType } from '@core/types'

export type BlockedPaymentsHook = (selectedMethod: BSPaymentMethodType | undefined) => {
  isPaymentMethodBlocked: boolean
  paymentErrorButton?: ReactNode
  paymentErrorCard?: ReactNode
}
