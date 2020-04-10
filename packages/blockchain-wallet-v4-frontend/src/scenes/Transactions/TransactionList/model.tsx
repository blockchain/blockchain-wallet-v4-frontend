import { FormattedMessage } from 'react-intl'
import { getOrderType } from 'data/components/simpleBuy/model'
import { SBOrderType } from 'core/types'
import { Text } from 'blockchain-info-components'
import React from 'react'

export const Status = ({ order }: { order: SBOrderType }) => {
  const type = getOrderType(order.pair)
  switch (order.state) {
    case 'FINISHED':
      return (
        <Text size='14px' weight={500} color='green600'>
          <FormattedMessage
            id='modals.simplebuy.transactionfeed.complete'
            defaultMessage='{type} Completed'
            values={{ type: type === 'BUY' ? 'Buy' : 'Sell' }}
          />
        </Text>
      )
    case 'PENDING_CONFIRMATION':
    case 'PENDING_DEPOSIT':
      return (
        <Text size='14px' weight={500}>
          <FormattedMessage
            id='modals.simplebuy.transactionfeed.waitingondepo'
            defaultMessage='Pending Deposit'
          />
        </Text>
      )
    case 'DEPOSIT_MATCHED':
      return (
        <Text size='14px' weight={500}>
          <FormattedMessage
            id='modals.simplebuy.transactionfeed.pending'
            defaultMessage='Pending {type}'
            values={{ type: type === 'BUY' ? 'Buy' : 'Sell' }}
          />
        </Text>
      )
    case 'CANCELED':
      return (
        <Text size='14px' weight={500} color='red600'>
          <FormattedMessage
            id='modals.simplebuy.transactionfeed.canceled'
            defaultMessage='{type} Canceled'
            values={{ type: type === 'BUY' ? 'Buy' : 'Sell' }}
          />
        </Text>
      )
    case 'FAILED':
    case 'EXPIRED':
      return (
        <Text size='14px' weight={500} color='red600'>
          <FormattedMessage
            id='modals.simplebuy.transactionfeed.failed'
            defaultMessage='{type} Failed'
            values={{ type: type === 'BUY' ? 'Buy' : 'Sell' }}
          />
        </Text>
      )
    default:
      return (
        <Text size='14px' weight={500} color='red600'>
          <FormattedMessage
            id='modals.simplebuy.transactionfeed.unknown'
            defaultMessage='Unknown Status'
          />
        </Text>
      )
  }
}
