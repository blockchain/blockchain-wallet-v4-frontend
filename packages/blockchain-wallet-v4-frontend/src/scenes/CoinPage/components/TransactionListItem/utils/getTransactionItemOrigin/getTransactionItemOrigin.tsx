import React, { ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import { BSOrderType, BSPaymentTypes } from '@core/types'
import { BankTransferAccountType } from 'data/types'
import { TransactionItem } from 'hooks'

import { isBSOrderType } from '../isBSOrderType'

const renderBankAccountOrigin = (
  transaction: BSOrderType,
  bankAccounts: BankTransferAccountType[]
): ReactNode => {
  const { paymentMethodId } = transaction

  const originBankAccount = bankAccounts.find((acct) => acct.id === paymentMethodId)

  if (!originBankAccount)
    return <FormattedMessage id='copy.bank_account' defaultMessage='Bank Account' />

  const { details } = originBankAccount

  return `${details.bankName} ${details.bankAccountType?.toLowerCase() || ''} ${
    details.accountNumber || ''
  }`
}

export const getTransactionItemOrigin = (
  transaction: TransactionItem,
  bankAccounts: BankTransferAccountType[]
) => {
  if (isBSOrderType(transaction)) {
    const { paymentType } = transaction

    if (!paymentType) return

    const bankAccountOrigin = renderBankAccountOrigin(transaction, bankAccounts)

    const mapPaymentTypeToOrigin: Record<BSPaymentTypes, ReactNode> = {
      BANK_ACCOUNT: 'Bank Transfer',
      BANK_TRANSFER: bankAccountOrigin,
      FUNDS: `${transaction.inputCurrency} Account`,
      LINK_BANK: bankAccountOrigin,
      PAYMENT_CARD: 'Credit/Debit Card',
      USER_CARD: 'Credit/Debit Card'
    }

    return mapPaymentTypeToOrigin[paymentType]
  }
}

export default getTransactionItemOrigin
