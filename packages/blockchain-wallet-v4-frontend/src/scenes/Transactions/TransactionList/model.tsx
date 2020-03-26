import { FormattedMessage } from 'react-intl'
import React from 'react'

export const Status = order => {
  switch (order.state) {
    case 'PENDING_CONFIRMATION':
    case 'PENDING_DEPOSIT':
      return (
        <FormattedMessage
          id='modals.simplebuy.transactionfeed.waitingondepo'
          defaultMessage='Pending Depost'
        />
      )
    case 'DEPOSIT_MATCHED':
      return (
        <FormattedMessage
          id='modals.simplebuy.transactionfeed.pending'
          defaultMessage='Pending Buy'
        />
      )
    default:
      return (
        <FormattedMessage
          id='modals.simplebuy.transactionfeed.unknown'
          defaultMessage='Unknown Status'
        />
      )
  }
}
