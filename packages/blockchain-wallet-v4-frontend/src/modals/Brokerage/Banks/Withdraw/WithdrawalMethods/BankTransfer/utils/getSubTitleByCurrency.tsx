import React, { ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import { FiatType } from '@core/types'

export const getSubTitleByCurrency = (currency: FiatType): ReactNode => {
  switch (currency) {
    case 'GBP':
    case 'EUR':
      return (
        <FormattedMessage id='copy.arrive_instantly' defaultMessage='Should arrive instantly' />
      )
    case 'USD':
      return (
        <FormattedMessage
          id='copy.arrive_in_3_business_days'
          defaultMessage='Should arrive in 3 business days'
        />
      )
    default:
      return <FormattedMessage id='copy.instantly_available' defaultMessage='Instantly Available' />
  }
}
