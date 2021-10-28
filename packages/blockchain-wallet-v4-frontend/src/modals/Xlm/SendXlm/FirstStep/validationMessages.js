import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Banner } from 'blockchain-info-components'
import { model } from 'data'

import MaximumAmountLink from './MaximumAmountLink'
import ModalIcon from './ModalIcon'

const { CREATE_ACCOUNT_LEARN_MODAL, RESERVE_LEARN_MODAL } = model.components.sendXlm

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
  <div data-e2e='sendXlmInvalidAmount'>
    <FormattedMessage id='modals.sendxlm.amountnotzeromessage' defaultMessage='Invalid amount' />
  </div>
)

export const ShouldCreateAccountMessage = (props) => (
  <ErrorBanner type='warning' data-e2e='sendXlmErrorSendAtLeast'>
    <FormattedMessage
      id='modals.sendxlm.shouldcreateaccountmessage'
      defaultMessage='You need to send at least {reserveXlm} XLM to this address'
      values={props}
    />
    <ModalIcon modal={CREATE_ACCOUNT_LEARN_MODAL} {...props} />
  </ErrorBanner>
)

export const NoFundsMessage = (props) => (
  <ErrorBanner type='warning'>
    <FormattedMessage
      id='modals.sendxlm.nofunds'
      defaultMessage='Your account is at the minimum balance'
    />
    <ModalIcon modal={RESERVE_LEARN_MODAL} {...props} />
  </ErrorBanner>
)

export const ReserveMessage = (props) => (
  <ErrorBanner type='warning' data-e2e='sendXlmUseTotalBalance'>
    <div>
      <FormattedMessage
        id='modals.sendxlm.usespendable'
        defaultMessage='Use total spendable balance'
      />
      {': '}
      <MaximumAmountLink {...props} />
      <br />
      <FormattedMessage
        id='modals.sendxlm.learnmore'
        defaultMessage='Learn about Stellar’s minimum balance requirement.'
      />
    </div>
    <ModalIcon modal={RESERVE_LEARN_MODAL} {...props} />
  </ErrorBanner>
)

export const InsufficientFundsMessage = () => (
  <FormattedMessage
    id='modals.sendxlm.insufficientfundsmessage'
    defaultMessage='Insufficient funds'
  />
)

export const WrongIdMemoFormat = () => (
  <div data-e2e='sendXlmWrongIdMemoFormat'>
    <FormattedMessage id='modals.sendxlm.wrongidmemo' defaultMessage='Memo should be a number' />
  </div>
)

export const WrongTextMemoFormat = () => (
  <div data-e2e='sendXlmWrongTextMemoFormat'>
    <FormattedMessage
      id='modals.sendxlm.wrongtextmemo'
      defaultMessage='Memo should be shorter than 28 symbols'
    />
  </div>
)
