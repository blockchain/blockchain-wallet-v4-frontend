import React, { ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import { FiatType } from '@core/types'

export const getSubTitleByCurrency = (currency: FiatType): ReactNode => {
  switch (currency) {
    case 'GBP':
      return <FormattedMessage id='copy.arrive_same_day' defaultMessage='Should arrive same day' />
    case 'EUR':
      return (
        <FormattedMessage
          id='copy.arrive_in_1_day'
          defaultMessage='Should arrive in 1 business day'
        />
      )
    case 'ARS':
      return (
        <FormattedMessage
          id='copy.number_of_business_days_ars'
          defaultMessage='{first} to {second} Business days'
          values={{ first: '1', second: '3' }}
        />
      )
    default:
      return (
        <FormattedMessage
          id='copy.number_of_business_days'
          defaultMessage='Should arrive in 3-5 business days'
        />
      )
  }
}
