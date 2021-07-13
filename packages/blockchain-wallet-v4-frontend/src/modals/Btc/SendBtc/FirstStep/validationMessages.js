import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import MaximumAmountLink from './MaximumAmountLink'
import MaximumFeeLink from './MaximumFeeLink'
import MinimumAmountLink from './MinimumAmountLink'
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
    id='modals.sendbtc.amountnotzeromessage'
    defaultMessage='Invalid amount'
  />
)

export const MaximumAmountMessage = () => (
  <Wrapper data-e2e='sendBtcNotEnoughFunds'>
    <FormattedMessage
      id='modals.sendbtc.maximumamountmessage'
      defaultMessage='Not enough funds. Use'
    />
    <MaximumAmountLink />
  </Wrapper>
)

export const MaximumFeeMessage = () => (
  <Wrapper>
    <FormattedMessage
      id='modals.sendbtc.maximumfeemessage'
      defaultMessage='Unnecessarily high fee.'
    />
    <span>&nbsp;</span>
    <MaximumFeeLink />
  </Wrapper>
)

export const MinimumAmountMessage = () => (
  <Wrapper>
    <FormattedMessage
      id='modals.sendbtc.minimumamountmessage'
      defaultMessage='Below minimum amount. Use'
    />
    <MinimumAmountLink />
  </Wrapper>
)

export const MinimumFeeMessage = () => (
  <Wrapper>
    <FormattedMessage
      id='modals.sendbtc.minimumfeemessage'
      defaultMessage='Low fee not recommended. Use'
    />
    <MinimumFeeLink />
  </Wrapper>
)

export const MinimumOneSatoshiMessage = () => (
  <FormattedMessage
    id='modals.sendbtc.minimumonesatoshimessage'
    defaultMessage='Minimum {sat} required'
    values={{ sat: '1 sat/byte' }}
  />
)

export const InsufficientFundsMessage = () => (
  <FormattedMessage
    id='modals.sendbtc.insufficientfundsmessage'
    defaultMessage='Insufficient funds'
  />
)

export const AddressMatchesPriv = () => (
  <FormattedMessage
    id='modals.sendbtc.addressprivmismatch'
    defaultMessage='This private key does not match the watch only address above'
  />
)
