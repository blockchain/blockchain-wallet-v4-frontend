import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'
import { SBPaymentTypes } from 'blockchain-wallet-v4/src/types'
import { getCoinFromPair, getOrderType } from 'data/components/simpleBuy/model'
import { BankTransferAccountType } from 'data/types'

import { IconTx as SharedIconTx, Timestamp as SharedTimestamp } from '../components'
import { Props } from '.'

export const IconTx = (props: Props) => {
  const orderType = getOrderType(props.order)
  const coin = getCoinFromPair(props.order.pair)
  return <SharedIconTx type={orderType} coin={coin} />
}

export const getOrigin = (props: Props, bankAccounts: Array<BankTransferAccountType>) => {
  switch (props.order.paymentType) {
    case SBPaymentTypes.FUNDS:
      return `${props.order.inputCurrency} Account`
    case SBPaymentTypes.PAYMENT_CARD:
    case SBPaymentTypes.USER_CARD:
      return 'Credit/Debit Card'
    case SBPaymentTypes.BANK_ACCOUNT:
      return 'Bank Transfer'
    case SBPaymentTypes.LINK_BANK:
    case SBPaymentTypes.BANK_TRANSFER:
      const bankAccount = bankAccounts.find((acct) => acct.id === props.order.paymentMethodId)
      if (bankAccount) {
        const { details } = bankAccount
        return `${details.bankName} ${details.bankAccountType?.toLowerCase() || ''} ${
          details.accountNumber || ''
        }`
      }
      return <FormattedMessage id='copy.bank_account' defaultMessage='Bank Account' />
    case undefined:
      return 'Unknown Payment Type'
    default:
      return ''
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
