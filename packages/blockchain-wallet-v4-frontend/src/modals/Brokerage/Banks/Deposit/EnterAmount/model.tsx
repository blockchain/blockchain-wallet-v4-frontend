import React from 'react'
import { FormattedMessage } from 'react-intl'

import { BankTransferAccountType } from 'data/types'

// TODO: move this somewhere more generic
import { renderBank } from '../../../../SimpleBuy/EnterAmount/Checkout/Payment/model'

const getText = method => {
  if (!method) {
    return (
      <FormattedMessage
        id='modals.brokerage.add_a_bank_account'
        defaultMessage='Add a Bank Account'
      />
    )
  } else {
    return renderBank(method)
  }
}

const getDefaultMethod = (
  defaultMethod,
  bankAccounts: BankTransferAccountType[]
) => {
  if (defaultMethod) {
    return { ...defaultMethod, type: 'BANK_TRANSFER' }
  } else if (bankAccounts.length === 1) {
    return { ...bankAccounts[0], type: 'BANK_TRANSFER' }
  }
}

export { getDefaultMethod, getText }
