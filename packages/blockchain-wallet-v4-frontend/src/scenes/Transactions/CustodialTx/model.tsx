import { Icon as BCIcon, Text } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import React from 'react'
import styled from 'styled-components'

import { CoinType, CoinTypeEnum, WalletFiatEnum } from 'core/types'
import {
  IconWrapper,
  IconTx as SharedIconTx,
  Timestamp as SharedTimestamp
} from '../components'
import { Props } from '.'
import Confirmations from '../NonCustodialTx/Confirmations'

const Icon = styled(BCIcon)`
  size: 18px;
  font-weight: 600;
`

export const IconTx = (props: Props) => {
  switch (props.tx.state) {
    case 'FINISHED':
      return (
        <IconWrapper color="fiat-light">
          <Icon size="20px" color="fiat" name="plus" />
        </IconWrapper>
      )
    case 'COMPLETE':
      return props.coin in WalletFiatEnum ? (
        <IconWrapper color="fiat-light">
          <Icon
            size="20px"
            color="fiat"
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
      return <SharedIconTx type="PENDING" />
    case 'CANCELED':
    case 'EXPIRED':
    case 'FAILED':
    case 'REFUNDED':
    case 'REJECTED':
    case 'UNIDENTIFIED':
      return props.coin in WalletFiatEnum ? (
        <IconWrapper color="red000">
          <Icon
            color="red600"
            size="20px"
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
        <IconWrapper color="grey000">
          <Icon size="20px" weight={500} color="grey600" name={'timer'} />
        </IconWrapper>
      )
  }
}

export const Timestamp = (props: Props) => {
  const getTimeOrStatus = () => {
    switch (props.tx.state) {
      case 'COMPLETE':
      case 'FINISHED':
        return <SharedTimestamp time={props.tx.insertedAt} />
      default:
        return <Status {...props} />
    }
  }

  return (
    <Text
      size="14px"
      weight={500}
      color="grey600"
      style={{ marginTop: '4px' }}
      data-e2e="txTimeOrStatus"
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
            id="components.form.tabmenutransactionstatus.received"
            defaultMessage="Received"
          />
        )
      case 'WITHDRAWAL':
        return (
          <FormattedMessage
            id="components.form.tabmenutransactionstatus.sent"
            defaultMessage="Sent"
          />
        )
      case 'REFUNDED':
        return <FormattedMessage id="copy.refunded" defaultMessage="Refunded" />
      case 'SELL':
        return <FormattedMessage id="copy.sold" defaultMessage="Sold" />
    }
  } else {
    switch (props.tx.type) {
      case 'DEPOSIT':
        return (
          <FormattedMessage id="buttons.deposited" defaultMessage="Deposited" />
        )
      case 'REFUNDED':
        return <FormattedMessage id="copy.refunded" defaultMessage="Refunded" />
      case 'SELL':
        return <FormattedMessage id="copy.sold" defaultMessage="Sold" />
      case 'WITHDRAWAL':
        return (
          <FormattedMessage id="buttons.withdrew" defaultMessage="Withdrew" />
        )
    }
  }
}

export const Origin = (props: Props) => {
  switch (props.tx.type) {
    case 'REFUNDED':
    case 'DEPOSIT':
      return props.tx.amount.symbol in CoinTypeEnum ? (
        <>{props.coinTicker} Wallet</>
      ) : (
        <>Bank Account</>
      )
    case 'SELL':
      return props.tx.extraAttributes?.direction === 'FROM_USERKEY' ? (
        <>{props.tx.amount.symbol} Wallet</>
      ) : (
        <>{props.tx.amount.symbol} Trading Wallet</>
      )
    case 'WITHDRAWAL':
      return <>{props.coinTicker} Wallet</>
  }
}

export const Destination = (props: Props) => {
  switch (props.tx.type) {
    case 'REFUNDED':
    case 'DEPOSIT':
      return <>{props.coinTicker} Wallet</>
    case 'SELL':
      return <>{props.coinTicker} Wallet</>
    case 'WITHDRAWAL':
      return props.tx.amount.symbol in CoinTypeEnum ? (
        <>{props.tx.amount.symbol} Wallet</>
      ) : (
        <>Bank Account</>
      )
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
      return <FormattedMessage id="copy.complete" defaultMessage="Complete" />
    case 'FAILED':
    case 'REFUNDED':
    case 'REJECTED':
    case 'UNIDENTIFIED':
      return <FormattedMessage id="copy.failed" defaultMessage="Failed" />
    case 'MANUAL_REVIEW':
      return <FormattedMessage id="copy.in_review" defaultMessage="In Review" />
    case 'CANCELED':
      return <FormattedMessage id="copy.canceled" defaultMessage="Canceled" />
    case 'EXPIRED':
      return (
        <FormattedMessage
          id="scenes.exchangehistory.list.orderstatus.expired"
          defaultMessage="Expired"
        />
      )
    default:
      return <FormattedMessage id="copy.pending" defaultMessage="Pending" />
  }
}
