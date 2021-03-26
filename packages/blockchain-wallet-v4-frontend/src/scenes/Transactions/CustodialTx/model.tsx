import React from 'react'
import { FormattedMessage } from 'react-intl'
import { path } from 'ramda'
import styled from 'styled-components'

import { Icon as BCIcon, Text } from 'blockchain-info-components'
import {
  CoinType,
  CoinTypeEnum,
  WalletFiatEnum
} from 'blockchain-wallet-v4/src/types'

import {
  IconTx as SharedIconTx,
  IconWrapper,
  Timestamp as SharedTimestamp
} from '../components'
import Confirmations from '../NonCustodialTx/Confirmations'
import { Props } from '.'

const Icon = styled(BCIcon)`
  size: 18px;
  font-weight: 600;
`
const getSymbolDisplayName = (props: Props) => {
  return path([props.tx.amount.symbol, 'coinTicker'], props.supportedCoins)
}

const getCoinDisplayName = (props: Props) => {
  return path([props.coin, 'coinTicker'], props.supportedCoins)
}

export const IconTx = (props: Props) => {
  switch (props.tx.state) {
    case 'FINISHED':
      return (
        <IconWrapper color='green400'>
          <Icon size='20px' color='USD' name='plus' />
        </IconWrapper>
      )
    case 'REFUNDED':
    case 'COMPLETE':
      return props.coin in WalletFiatEnum ? (
        <IconWrapper color='green400'>
          <Icon
            size='20px'
            color='USD'
            name={props.tx.type === 'DEPOSIT' ? 'arrow-down' : 'arrow-up'}
          />
        </IconWrapper>
      ) : (
        <SharedIconTx
          type={props.tx.type === 'DEPOSIT' ? 'received' : 'sent'}
          coin={props.coin as CoinType}
        />
      )
    case 'CLEARED':
    case 'CREATED':
    case 'FRAUD_REVIEW':
    case 'MANUAL_REVIEW':
    case 'PENDING':
    case 'PENDING_DEPOSIT':
      return <SharedIconTx type='PENDING' />
    case 'CANCELED':
    case 'EXPIRED':
    case 'FAILED':
    case 'REJECTED':
    case 'UNIDENTIFIED':
      return props.coin in WalletFiatEnum ? (
        <IconWrapper color='red500'>
          <Icon
            color='red600'
            size='20px'
            name={props.tx.type === 'DEPOSIT' ? 'arrow-down' : 'arrow-up'}
          />
        </IconWrapper>
      ) : (
        <SharedIconTx
          type={props.tx.type === 'DEPOSIT' ? 'received' : 'sent'}
          coin={props.coin as CoinType}
        />
      )
    default:
      return (
        <IconWrapper color='grey500'>
          <Icon size='20px' weight={500} color='grey600' name={'timer'} />
        </IconWrapper>
      )
  }
}

export const Timestamp = (props: Props) => {
  const getTimeOrStatus = () => {
    switch (props.tx.state) {
      case 'COMPLETE':
      case 'FINISHED':
      case 'REFUNDED':
        return <SharedTimestamp time={props.tx.insertedAt} />
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

export const TransactionType = (props: Props) => {
  if (props.tx.amount.symbol in CoinTypeEnum) {
    switch (props.tx.type) {
      case 'DEPOSIT':
        return (
          <FormattedMessage
            id='components.form.tabmenutransactionstatus.received'
            defaultMessage='Received'
          />
        )
      case 'WITHDRAWAL':
        return (
          <FormattedMessage
            id='components.form.tabmenutransactionstatus.sent'
            defaultMessage='Sent'
          />
        )
      case 'REFUNDED':
        return <FormattedMessage id='copy.refunded' defaultMessage='Refunded' />
      case 'SELL':
        return <FormattedMessage id='copy.sold' defaultMessage='Sold' />
      default:
        return <></>
    }
  } else {
    switch (props.tx.type) {
      case 'DEPOSIT':
        return props.tx.state === 'REFUNDED' ? (
          <FormattedMessage id='copy.refunded' defaultMessage='Refunded' />
        ) : (
          <FormattedMessage id='buttons.deposited' defaultMessage='Deposited' />
        )
      case 'REFUNDED':
        return <FormattedMessage id='copy.refunded' defaultMessage='Refunded' />
      case 'SELL':
        return <FormattedMessage id='copy.sold' defaultMessage='Sold' />
      case 'WITHDRAWAL':
        return (
          <FormattedMessage id='buttons.withdrew' defaultMessage='Withdrew' />
        )
      default:
        return <></>
    }
  }
}

export const Origin = (props: Props) => {
  switch (props.tx.type) {
    case 'REFUNDED':
    case 'DEPOSIT':
      return props.tx.amount.symbol in CoinTypeEnum ? (
        <>{getCoinDisplayName(props)} Account</>
      ) : (
        <>Bank Account</>
      )
    case 'SELL':
      return props.tx.extraAttributes?.direction === 'FROM_USERKEY' ? (
        <> {getSymbolDisplayName(props)} Account</>
      ) : (
        <>{getSymbolDisplayName(props)} Trading Account</>
      )
    case 'WITHDRAWAL':
      return <>{getSymbolDisplayName(props)} Account</>
    default:
      return <></>
  }
}

export const Destination = (props: Props) => {
  switch (props.tx.type) {
    case 'REFUNDED':
    case 'DEPOSIT':
    case 'SELL':
      return <>{getCoinDisplayName(props)} Account</>
    case 'WITHDRAWAL':
      return props.tx.amount.symbol in CoinTypeEnum ? (
        <>{getSymbolDisplayName(props)} Account</>
      ) : (
        <>Bank Account</>
      )
    default:
      return <></>
  }
}

export const Status = (props: Props) => {
  switch (props.tx.state) {
    case 'COMPLETE':
    case 'FINISHED':
      if (
        props.tx.amount.symbol in CoinTypeEnum &&
        props.tx.extraAttributes?.confirmations
      ) {
        return (
          <Confirmations
            coin={props.tx.amount.symbol}
            hash={props.tx.extraAttributes.hash}
            isConfirmed={props.tx.extraAttributes.confirmations >= 1}
            onViewTxDetails={() => {}}
          />
        )
      }
      return <FormattedMessage id='copy.complete' defaultMessage='Complete' />
    case 'REFUNDED':
      return <FormattedMessage id='copy.refunded' defaultMessage='Refunded' />
    case 'FAILED':
    case 'REJECTED':
    case 'UNIDENTIFIED':
      return <FormattedMessage id='copy.failed' defaultMessage='Failed' />
    case 'MANUAL_REVIEW':
      return <FormattedMessage id='copy.in_review' defaultMessage='In Review' />
    case 'CANCELED':
      return <FormattedMessage id='copy.canceled' defaultMessage='Canceled' />
    case 'EXPIRED':
      return (
        <FormattedMessage
          id='scenes.exchangehistory.list.orderstatus.expired'
          defaultMessage='Expired'
        />
      )
    default:
      return <FormattedMessage id='copy.pending' defaultMessage='Pending' />
  }
}
