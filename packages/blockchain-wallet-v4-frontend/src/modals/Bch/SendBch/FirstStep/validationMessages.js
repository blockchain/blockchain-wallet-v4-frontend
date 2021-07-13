import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import MaximumAmountLink from './MaximumAmountLink'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;

  > * {
    margin: 0 0 0 2px;
  }
`

export const InvalidAmountMessage = () => (
  <FormattedMessage
    id='modals.sendbch.amountnotzeromessage'
    defaultMessage='Invalid amount'
  />
)

export const MaximumAmountMessage = () => (
  <Wrapper>
    <FormattedMessage
      id='modals.sendbch.maximumamountmessage'
      defaultMessage='Not enough funds. Use'
    />
    <MaximumAmountLink />
  </Wrapper>
)

export const InsufficientFundsMessage = () => (
  <FormattedMessage
    id='modals.sendbch.insufficientfundsmessage'
    defaultMessage='Insufficient funds'
  />
)
