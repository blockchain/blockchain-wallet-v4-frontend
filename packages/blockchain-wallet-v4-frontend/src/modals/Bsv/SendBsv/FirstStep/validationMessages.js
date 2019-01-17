import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

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
    id='modals.sendbsv.amountnotzeromessage'
    defaultMessage='Invalid amount'
  />
)

export const MaximumAmountMessage = () => (
  <Wrapper>
    <FormattedMessage
      id='modals.sendbsv.maximumamountmessage'
      defaultMessage='Not enough funds. Use'
    />
    <MaximumAmountLink />
  </Wrapper>
)

export const InsufficientFundsMessage = () => (
  <FormattedMessage
    id='modals.sendbsv.insufficientfundsmessage'
    defaultMessage='Insufficient funds'
  />
)
