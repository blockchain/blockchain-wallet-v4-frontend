import React from 'react'
import { FormattedMessage } from 'react-intl'

import { BSPaymentMethodType, BSPaymentTypes, CardFundSourceType } from '@core/types'

const hasDebitFunds = ({ cardFundSources }: BSPaymentMethodType) =>
  cardFundSources?.includes(CardFundSourceType.DEBIT) &&
  !cardFundSources?.includes(CardFundSourceType.CREDIT)

const hasCreditFunds = ({ cardFundSources }: BSPaymentMethodType) =>
  cardFundSources?.includes(CardFundSourceType.CREDIT) &&
  !cardFundSources?.includes(CardFundSourceType.DEBIT)

export const getType = (value: BSPaymentMethodType) => {
  switch (value.type) {
    case BSPaymentTypes.BANK_TRANSFER:
    case BSPaymentTypes.LINK_BANK:
      return (
        <FormattedMessage
          id='modals.simplebuy.easybanktransfer'
          defaultMessage='Easy Bank Transfer'
        />
      )
    case BSPaymentTypes.BANK_ACCOUNT:
      return value.currency === 'USD' ? (
        <FormattedMessage id='modals.simplebuy.bankwire' defaultMessage='Wire Transfer' />
      ) : (
        <FormattedMessage
          id='modals.simplebuy.deposit.bank_transfer'
          defaultMessage='Bank Transfer'
        />
      )
    case BSPaymentTypes.PAYMENT_CARD:
      if (hasDebitFunds(value)) {
        return (
          <FormattedMessage id='modals.simplebuy.paymentcard.debit' defaultMessage='Debit Card' />
        )
      }

      if (hasCreditFunds(value)) {
        return (
          <FormattedMessage id='modals.simplebuy.paymentcard.credit' defaultMessage='Credit Card' />
        )
      }

      return (
        <FormattedMessage
          id='modals.simplebuy.paymentcard.debit_and_credit'
          defaultMessage='Credit or Debit Card'
        />
      )
    case BSPaymentTypes.USER_CARD:
      if (value?.card) {
        return value.card.label ?? value.card.type
      }

      if (hasDebitFunds(value)) {
        return (
          <FormattedMessage id='modals.simplebuy.paymentcard.debit' defaultMessage='Debit Card' />
        )
      }

      if (hasCreditFunds(value)) {
        return (
          <FormattedMessage id='modals.simplebuy.paymentcard.credit' defaultMessage='Credit Card' />
        )
      }

      return (
        <FormattedMessage
          id='modals.simplebuy.paymentcard.debit_and_credit'
          defaultMessage='Credit or Debit Card'
        />
      )
    case BSPaymentTypes.FUNDS:
    default:
      return ''
  }
}
