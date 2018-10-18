import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import MaximumAmountLink from './MaximumAmountLink'
import ReserveLearnLink from './ReserveLearnLink'

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
    id='modals.sendxlm.amountnotzeromessage'
    defaultMessage='Invalid amount'
  />
)

export const MaximumAmountMessage = () => (
  <Wrapper>
    <FormattedMessage
      id='modals.sendxlm.maximumamountmessage'
      defaultMessage='Not enough funds. Use'
    />
    <MaximumAmountLink />
  </Wrapper>
)

export const ShouldCreateAccountMessage = ({ amount }) => (
  <Wrapper>
    <FormattedMessage
      id='modals.sendxlm.shouldcreateaccountmessage'
      defaultMessage='You need to send at least {amount} XLM to this address'
      values={{ amount }}
    />
    <ReserveLearnLink />
  </Wrapper>
)

export const ReserveMessage = () => (
  <Wrapper>
    <FormattedMessage
      id='modals.sendxlm.reservemessage'
      defaultMessage='This amount will leave your wallet with an insufficient xlm balance'
    />
    <MaximumAmountLink />
  </Wrapper>
)

export const InsufficientFundsMessage = () => (
  <FormattedMessage
    id='modals.sendxlm.insufficientfundsmessage'
    defaultMessage='Insufficient funds'
  />
)
