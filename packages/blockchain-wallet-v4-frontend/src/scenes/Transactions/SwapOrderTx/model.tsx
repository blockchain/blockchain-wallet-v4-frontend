import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'
import { getInput, getOutput } from 'data/components/swap/model'

import { IconTx as SharedIconTx, Timestamp as SharedTimestamp } from '../components'
import { Props } from '.'

const getOutputCoinDisplayName = (props: Props) => {
  return getOutput(props.order)
}
const getInputCoinDisplayName = (props: Props) => {
  return getInput(props.order)
}
export const IconTx = (props: Props) => {
  return <SharedIconTx type='SWAP' coin={props.coin} />
}

export const getDestination = (props: Props) => {
  switch (props.order.kind.direction) {
    case 'TO_USERKEY':
    case 'ON_CHAIN':
      return `${getOutputCoinDisplayName(props)} Private Key Wallet`
    case 'FROM_USERKEY':
    case 'INTERNAL':
      return `${getOutputCoinDisplayName(props)} Trading Account`
    default:
      return ''
  }
}

export const getOrigin = (props: Props) => {
  switch (props.order.kind.direction) {
    case 'FROM_USERKEY':
    case 'ON_CHAIN':
      return `${getInputCoinDisplayName(props)} Private Key Wallet`
    case 'TO_USERKEY':
    case 'INTERNAL':
      return `${getInputCoinDisplayName(props)} Trading Account`
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
