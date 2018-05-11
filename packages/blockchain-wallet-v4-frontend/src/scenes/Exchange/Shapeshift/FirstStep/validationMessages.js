
import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'
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
    <Text size='12px' weight={300} color='error'>
      <FormattedMessage id='modals.exchange.maximumamountmessage' defaultMessage='Maximum amount exceeded.' />
    </Text>
    <Text size='12px' weight={300}>
      <FormattedMessage id='modals.exchange.maximumamountmessage2' defaultMessage='Use' />
    </Text>
    <MaximumAmountLink />
  </Wrapper>
)

export const MinimumAmountMessage = () => (
  <Wrapper>
    <Text size='12px' weight={300} color='error'>
      <FormattedMessage id='modals.exchange.minimumamountmessage' defaultMessage='Below minimum amount.' />
    </Text>
    <Text size='12px' weight={300}>
      <FormattedMessage id='modals.exchange.minimumamountmessage2' defaultMessage='Use' />
    </Text>
    <MinimumAmountLink />
  </Wrapper>
)

export const InsufficientAmountMessage = () => (
  <Text size='12px' weight={300} color='error'>
    <FormattedMessage id='modals.exchange.insufficientamountmessage' defaultMessage='Insufficient funds' />
  </Text>
)
