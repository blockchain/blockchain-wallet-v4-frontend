import { FormattedMessage } from 'react-intl'
import { getInput, getOutput } from 'data/components/swap/model'
import React from 'react'

import { Props } from '.'
import {
  IconTx as SharedIconTx,
  Timestamp as SharedTimestamp
} from '../components'
import { Text } from 'blockchain-info-components'

export const IconTx = (props: Props) => {
  return <SharedIconTx type='SWAP' coin={props.coin} />
}

export const getDestination = (props: Props) => {
  switch (props.order.kind.direction) {
    case 'TO_USERKEY':
    case 'ON_CHAIN':
      return (
        props.supportedCoins[getOutput(props.order)].displayName + ' Wallet'
      )
    case 'FROM_USERKEY':
    case 'INTERNAL':
      return (
        props.supportedCoins[getOutput(props.order)].displayName +
        ' Trading Wallet'
      )
    default:
      return ''
  }
}

export const getOrigin = (props: Props) => {
  switch (props.order.kind.direction) {
    case 'FROM_USERKEY':
    case 'ON_CHAIN':
      return props.supportedCoins[getInput(props.order)].displayName + ' Wallet'
    case 'TO_USERKEY':
    case 'INTERNAL':
      return (
        props.supportedCoins[getInput(props.order)].displayName +
        ' Trading Wallet'
      )
    default:
      return ''
  }
}

export const Status = ({ order }: Props) => {
  switch (order.state) {
    case 'FINISHED':
      return (
        <FormattedMessage
          id='modals.simplebuy.transactionfeed.complete'
          defaultMessage='{type} Completed'
          values={{ type: 'Swap' }}
        />
      )
    case 'PENDING_WITHDRAWAL':
      return <>Pending Withdrawal</>
    case 'PENDING_EXECUTION':
      return <>Pending Execution</>
    case 'PENDING_CONFIRMATION':
    case 'PENDING_DEPOSIT':
      return (
        <FormattedMessage
          id='modals.simplebuy.transactionfeed.waitingondepo'
          defaultMessage='Pending Deposit'
        />
      )
    case 'CANCELED':
      return (
        <FormattedMessage
          id='modals.simplebuy.transactionfeed.canceled'
          defaultMessage='{type} Canceled'
          values={{ type: 'Swap' }}
        />
      )
    case 'FAILED':
    case 'EXPIRED':
      return (
        <FormattedMessage
          id='modals.simplebuy.transactionfeed.failed'
          defaultMessage='{type} Failed'
          values={{ type: 'Swap' }}
        />
      )
    default:
      return <>{order.state}</>
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
      size='13px'
      weight={500}
      color='grey600'
      style={{ marginTop: '4px' }}
      data-e2e='txTimeOrStatus'
    >
      {getTimeOrStatus()}
    </Text>
  )
}
