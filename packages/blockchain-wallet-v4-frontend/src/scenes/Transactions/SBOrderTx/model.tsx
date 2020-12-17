import { FormattedMessage } from 'react-intl'
import { getCoinFromPair, getOrderType } from 'data/components/simpleBuy/model'
import React from 'react'

import { Props } from '.'
import {
  IconTx as SharedIconTx,
  Timestamp as SharedTimestamp
} from '../components'
import { Text } from 'blockchain-info-components'

export const IconTx = (props: Props) => {
  const orderType = getOrderType(props.order)
  const coin = getCoinFromPair(props.order.pair)
  return <SharedIconTx type={orderType} coin={coin} />
}

export const getOrigin = (props: Props) => {
  switch (props.order.paymentType) {
    case 'FUNDS':
      return props.order.inputCurrency + ' Wallet'
    case 'PAYMENT_CARD':
    case 'USER_CARD':
      return 'Credit/Debit Card'
    case 'BANK_ACCOUNT':
      return 'Bank Transfer'
    case 'LINK_BANK':
    case 'BANK_TRANSFER': // LOL this is so bad
      return 'Bank Account'
    case undefined:
      return 'Unknown Payment Type'
  }
}

export const Status = ({ order }: Props) => {
  const type = getOrderType(order)
  switch (order.state) {
    case 'FINISHED':
      return (
        <FormattedMessage
          id='modals.simplebuy.transactionfeed.complete'
          defaultMessage='{type} Completed'
          values={{ type: type === 'BUY' ? 'Buy' : 'Sell' }}
        />
      )
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
    case 'CANCELED':
      return (
        <FormattedMessage
          id='modals.simplebuy.transactionfeed.canceled'
          defaultMessage='{type} Canceled'
          values={{ type: type === 'BUY' ? 'Buy' : 'Sell' }}
        />
      )
    case 'FAILED':
    case 'EXPIRED':
      return (
        <FormattedMessage
          id='modals.simplebuy.transactionfeed.failed'
          defaultMessage='{type} Failed'
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

export const Timestamp = (props: Props) => {
  const getTimeOrStatus = () => {
    switch (props.order.state) {
      case 'FINISHED':
        return <SharedTimestamp time={props.order.insertedAt} />
      default:
        return <Status {...props} />
    }
  }

  return (
    <Text
      size='14px'
      weight={500}
      color='grey600'
      style={{ marginTop: '4px' }}
      data-e2e='txTimeOrStatus'
    >
      {getTimeOrStatus()}
    </Text>
  )
}
