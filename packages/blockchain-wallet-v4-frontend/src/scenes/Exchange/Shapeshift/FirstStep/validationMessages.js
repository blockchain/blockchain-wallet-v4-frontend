
import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import MaximumAmountLink from './MaximumAmountLink'
import MinimumAmountLink from './MinimumAmountLink'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;

  > * { margin-left: 2px; }
`

export const MaximumAmountMessage = () => (
  <Wrapper>
    <FormattedMessage id='modals.exchange.maximumamountmessage' defaultMessage='Maximum amount exceeded. Use' />
    <MaximumAmountLink />
  </Wrapper>
)

export const MinimumAmountMessage = () => (
  <Wrapper>
    <FormattedMessage id='modals.exchange.minimumamountmessage' defaultMessage='Below minimum amount. Use' />
    <MinimumAmountLink />
  </Wrapper>
)

export const InsufficientAmountMessage = () =>
  <FormattedMessage id='modals.exchange.insufficientamountmessage' defaultMessage='Insufficient funds' />
