import { FormattedMessage } from 'react-intl'
import React from 'react'

import { FiatType } from 'core/types'

const DepositOrWithdrawal = (props: {
  fiatCurrency: FiatType,
  orderType: 'DEPOSIT' | 'WITHDRAWAL'
}) => {
  return props.orderType === 'DEPOSIT' ? (
    <FormattedMessage
      id='modals.brokerage.deposit_fiat'
      defaultMessage='Deposit {fiat}'
      values={{ fiat: props.fiatCurrency }}
    />
  ) : (
    <FormattedMessage
      id='modals.brokerage.withdraw_fiat'
      defaultMessage='Withdraw {fiat}'
      values={{ fiat: props.fiatCurrency }}
    />
  )
}

export { DepositOrWithdrawal }
