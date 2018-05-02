
import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import MaximumAmountLink from './MaximumAmountLink'
import MaximumFeeLink from './MaximumFeeLink'
import MinimumAmountLink from './MinimumAmountLink'
import MinimumFeeLink from './MinimumFeeLink'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;

  > * { margin-left: 2px; }
`

export const MaximumAmountMessage = () => (
  <Wrapper>
    <FormattedMessage id='modals.sencbtc.maximumamountmessage' defaultMessage='Maximum amount exceeded. Use' />
    <MaximumAmountLink />
  </Wrapper>
)

export const MaximumFeeMessage = () => (
  <Wrapper>
    <FormattedMessage id='modals.sencbtc.maximumfeemessage' defaultMessage='Maximum fee exceeded. Use' />
    <MaximumFeeLink />
  </Wrapper>
)

export const MinimumAmountMessage = () => (
  <Wrapper>
    <FormattedMessage id='modals.sencbtc.minimumamountmessage' defaultMessage='Below minimum amount. Use' />
    <MinimumAmountLink />
  </Wrapper>
)

export const MinimumFeeMessage = () => (
  <Wrapper>
    <FormattedMessage id='modals.sencbtc.minimumfeemessage' defaultMessage='Below minimum fee. Use' />
    <MinimumFeeLink />
  </Wrapper>
)

export const EmptyAccount = () => (
  <FormattedMessage id='modals.sencbtc.nomoney' defaultMessage='No money to spend on this account' />
)

export const AddressMatchesPriv = () => (
  <FormattedMessage id='modals.sencbtc.addressprivmismatch' defaultMessage='This private key does not match the watch only address above' />
)
