import React from 'react'
import { FormattedMessage } from 'react-intl'

import { SBPaymentTypes } from 'blockchain-wallet-v4/src/types'
import { BankTransferAccountType } from 'data/types'

// TODO: move this somewhere more generic
import { renderBank } from '../../../../SimpleBuy/EnterAmount/Checkout/Payment/model'

const getText = (method) => {
  if (!method) {
    return (
      <FormattedMessage
        id='modals.brokerage.add_a_bank_account'
        defaultMessage='Add a Bank Account'
      />
    )
  }
  return renderBank(method)
}

const getDefaultMethod = (defaultMethod, bankAccounts: BankTransferAccountType[]) => {
  if (defaultMethod) {
    return { ...defaultMethod, type: SBPaymentTypes.BANK_TRANSFER }
  }
  if (bankAccounts.length === 1) {
    return { ...bankAccounts[0], type: SBPaymentTypes.BANK_TRANSFER }
  }
}

export { getDefaultMethod, getText }
