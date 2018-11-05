import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import MaximumAmountLink from './MaximumAmountLink'
import MaximumFeeLink from './MaximumFeeLink'
import MinimumFeeLink from './MinimumFeeLink'

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
    id='modals.sendeth.amountnotzeromessage'
    defaultMessage='Invalid amount'
  />
)

export const MaximumAmountMessage = () => (
  <Wrapper>
    <FormattedMessage
      id='modals.sendeth.maximumamountmessage'
      defaultMessage='Not enough funds. Use'
    />
    <MaximumAmountLink />
  </Wrapper>
)

export const InsufficientFundsMessage = () => (
  <FormattedMessage
    id='modals.sendeth.insufficientfundsmessage'
    defaultMessage='Insufficient funds'
  />
)

export const MaximumFeeMessage = () => (
  <Wrapper>
    <FormattedMessage
      id='modals.sendeth.maximumfeemessage'
      defaultMessage='Unnecessarily high fee.'
    />
    <span>&nbsp;</span>
    <MaximumFeeLink />
  </Wrapper>
)
export const MinimumFeeMessage = () => (
  <Wrapper>
    <FormattedMessage
      id='modals.sendeth.minimumfeemessage'
      defaultMessage='Low fee not recommended. Use'
    />
    <MinimumFeeLink />
  </Wrapper>
)
