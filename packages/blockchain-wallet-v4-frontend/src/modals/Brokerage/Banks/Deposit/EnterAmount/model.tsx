import { FormattedMessage } from 'react-intl'
import { Icon } from 'blockchain-info-components'
import React from 'react'
import styled, { css } from 'styled-components'

import { BankTransferAccountType } from 'core/types'

import { renderBank } from '../../../../SimpleBuy/EnterAmount/Checkout/Payment/model'

const RightArrowIcon = styled(Icon)<{
  disabled?: boolean
}>`
  transform: rotate(180deg);
  ${props =>
    props.disabled &&
    css`
      cursor: not-allowed;
    `}
`

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

export { getText, RightArrowIcon, getDefaultMethod }
