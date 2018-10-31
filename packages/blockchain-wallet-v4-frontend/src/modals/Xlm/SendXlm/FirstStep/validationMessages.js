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
  <FormattedMessage
    id='modals.sendxlm.wrongidmemo'
    defaultMessage='Memo should be a number'
  />
)

export const WrongTextMemoFormat = () => (
  <FormattedMessage
    id='modals.sendxlm.wrongtextmemo'
    defaultMessage='Memo should be shorter than 28 symbols'
  />
)
