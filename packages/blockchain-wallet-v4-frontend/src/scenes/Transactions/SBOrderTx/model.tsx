import { DefaultTheme } from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { getCoinFromPair, getOrderType } from 'data/components/simpleBuy/model'
import { Icon, Text } from 'blockchain-info-components'
import moment from 'moment'
import React from 'react'

import { IconWrapper } from '../components'
import { Props } from '.'
import { SBOrderType } from 'core/types'

export const IconTx = (props: Props) => {
  const orderType = getOrderType(props.order)
  const coin = getCoinFromPair(props.order.pair)
  return (
    <IconWrapper color={(coin.toLowerCase() + '-light') as keyof DefaultTheme}>
      <Icon
        size='24px'
        weight={600}
        name={orderType === 'BUY' ? 'plus' : 'minus'}
        color={coin.toLowerCase() as keyof DefaultTheme}
      />
    </IconWrapper>
  )
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
    case undefined:
      return 'Unknown Payment Type'
  }
}

export const Timestamp = (props: Props) => {
  const getTimeOrStatus = () => {
    switch (props.order.state) {
      case 'FINISHED':
      case 'FAILED':
      case 'DEPOSIT_MATCHED':
        return moment(props.order.insertedAt).format('MMM. D, YYYY')
      case 'EXPIRED':
        return 'Expired'
      case 'CANCELED':
        return 'Canceled'
      case 'PENDING_DEPOSIT':
        return 'Pending Deposit'
      case 'PENDING_CONFIRMATION':
        return 'Pending Confirmation'
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

export const Status = ({ order }: { order: SBOrderType }) => {
  const type = getOrderType(order)
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
