import React from 'react'
import { FormattedMessage } from 'react-intl'

import { PlaidSettlementErrorReasons } from 'data/types'

export default function usePaymentErrorReason(reason: PlaidSettlementErrorReasons) {
  let title: React.ReactNode
  let message: React.ReactNode
  let actionText: React.ReactNode

  switch (reason) {
    case 'REQUIRES_UPDATE':
      title = (
        <FormattedMessage
          id='modals.brokerage.plaid_refresh_error.title'
          defaultMessage='One last thing...'
        />
      )
      message = (
        <FormattedMessage
          id='modals.brokerage.plaid_refresh_error.message'
          defaultMessage='We need to quickly relink your bank account. The process will only take a minute.'
        />
      )
      actionText = <FormattedMessage id='copy.relink' defaultMessage='Relink' />
      break
    case 'INSUFFICIENT_BALANCE':
      title = (
        <FormattedMessage
          id='modals.brokerage.insufficient_balance.title'
          defaultMessage='Check your balance!'
        />
      )
      message = (
        <FormattedMessage
          id='modals.brokerage.insufficient_balance.message'
          defaultMessage='The balance reported by the bank is too low for this payment.'
        />
      )
      actionText = <FormattedMessage id='copy.try_again' defaultMessage='Try Again' />
      break
    case 'GENERIC':
    case 'STALE_BALANCE':
    default:
      title = (
        <FormattedMessage
          id='modals.brokerage.generic_error.title'
          defaultMessage='We had an issue with your payment'
        />
      )
      message = (
        <FormattedMessage
          id='modals.brokerage.generic_error.message'
          defaultMessage="We're having trouble processing your payment. Please try again later."
        />
      )
      actionText = <FormattedMessage id='copy.try_again' defaultMessage='Try Again' />
      break
  }
  return [title, message, actionText]
}
