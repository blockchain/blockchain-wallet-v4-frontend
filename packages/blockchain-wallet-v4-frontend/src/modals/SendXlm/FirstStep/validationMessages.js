import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { model } from 'data'
import { Banner } from 'blockchain-info-components'
import MaximumAmountLink from './MaximumAmountLink'
import ModalIcon from './ModalIcon'

const {
  CREATE_ACCOUNT_LEARN_MODAL,
  RESERVE_LEARN_MODAL
} = model.components.sendXlm

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;

  > * {
    margin: 0 0 0 2px;
  }
`

const ErrorBanner = styled(Banner)`
  > span {
    display: none;
  }
  > div {
    text-transform: none;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }
  margin-bottom: 16px;
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

export const ShouldCreateAccountMessage = props => (
  <ErrorBanner type='warning'>
    <FormattedMessage
      id='modals.sendxlm.shouldcreateaccountmessage'
      defaultMessage='You need to send at least {reserveXlm} XLM to this address'
      values={props}
    />
    <ModalIcon modal={CREATE_ACCOUNT_LEARN_MODAL} {...props} />
  </ErrorBanner>
)

export const ReserveMessage = props => (
  <ErrorBanner type='warning'>
    <FormattedMessage
      id='modals.sendxlm.reservemessage'
      defaultMessage='Insufficient balance. To maintain Stellar’s minimum balance of {reserveXlm} XLM the most that you can send is {currencySymbol}{effectiveBalanceFiat} ({effectiveBalanceXlm} XLM) minus fee.'
      values={props}
    />
    <ModalIcon modal={RESERVE_LEARN_MODAL} {...props} />
  </ErrorBanner>
)

export const InsufficientFundsMessage = () => (
  <FormattedMessage
    id='modals.sendxlm.insufficientfundsmessage'
    defaultMessage='Insufficient funds'
  />
)
