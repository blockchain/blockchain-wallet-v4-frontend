import { FormattedMessage } from 'react-intl'
import { getOrderType } from 'data/components/simpleBuy/model'
import { SBOrderType } from 'core/types'
import React from 'react'

export const Status = ({ order }: { order: SBOrderType }) => {
  const type = getOrderType(order)
  switch (order.state) {
    case 'PENDING_CONFIRMATION':
    case 'PENDING_DEPOSIT':
      return (
        <FormattedMessage
          id='modals.simplebuy.transactionfeed.waitingondepo'
          defaultMessage='Pending Deposit'
        />
      )
    case 'DEPOSIT_MATCHED':
      return (
        <FormattedMessage
          id='modals.simplebuy.transactionfeed.pending'
          defaultMessage='Pending {type}'
          values={{ type: type === 'BUY' ? 'Buy' : 'Sell' }}
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
