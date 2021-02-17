import { FormattedMessage } from 'react-intl'
import { Icon } from 'blockchain-info-components'
import React from 'react'
import styled, { css } from 'styled-components'

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
  }
}

export { getText, RightArrowIcon }
