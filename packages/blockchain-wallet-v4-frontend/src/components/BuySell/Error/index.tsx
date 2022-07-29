import React from 'react'
import styled from 'styled-components'

import { FlyoutWrapper } from 'components/Flyout'
import { CARD_ERROR_CODE, ORDER_ERROR_CODE } from 'data/components/buySell/model'

import BankDecline from './BankDecline'
import CreateFailed from './CreateFailed'
import Duplicate from './Duplicate'
import InsufficientFunds from './InsufficientFunds'
import InternalServerError from './InternalServerError'
import PaymentFailed from './PaymentFailed'
import PendingAfterPoll from './PendingAfterPoll'
import ProblemCollecting from './ProblemCollecting'
import TryAnotherCard from './TryAnotherCard'

const Wrapper = styled(FlyoutWrapper)`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  text-align: center;
`

const Error = ({ code, handleBack, handleReset, handleRetry }: Props) => {
  const renderError = () => {
    switch (code) {
      case CARD_ERROR_CODE.INSUFFICIENT_FUNDS:
      case ORDER_ERROR_CODE.CARD_PAYMENT_INSUFFICIENT_FUNDS:
        return <InsufficientFunds handleBack={handleBack} handleRetry={handleRetry} />

      case CARD_ERROR_CODE.BANK_DECLINE:
      case CARD_ERROR_CODE.ACQUIRER_DECLINE:
      case CARD_ERROR_CODE.BLOCKED_CARD_AFTER_POLL:
      case CARD_ERROR_CODE.PAYMENT_NOT_SUPPORTED:
      case ORDER_ERROR_CODE.CARD_CREATE_BANK_DECLINED:
      case ORDER_ERROR_CODE.CARD_PAYMENT_BANK_DECLINED:
      case ORDER_ERROR_CODE.CARD_PAYMENT_NOT_SUPPORTED:
        return <BankDecline handleBack={handleBack} handleRetry={handleRetry} />

      case CARD_ERROR_CODE.DUPLICATE:
      case ORDER_ERROR_CODE.CARD_CREATE_DUPLICATE:
        return <Duplicate handleBack={handleBack} />

      case CARD_ERROR_CODE.CREATE_FAILED:
      case CARD_ERROR_CODE.LINK_CARD_FAILED:
      case CARD_ERROR_CODE.INVALID_PAYMENT_METHOD:
      case ORDER_ERROR_CODE.CARD_CREATE_FAILED:
      case ORDER_ERROR_CODE.CARD_CREATE_NO_TOKEN:
      case ORDER_ERROR_CODE.CARD_PAYMENT_ABANDONED:
      case ORDER_ERROR_CODE.CARD_PAYMENT_FAILED:
        return <CreateFailed handleBack={handleBack} handleRetry={handleRetry} />

      case CARD_ERROR_CODE.PAYMENT_FAILED:
        return <PaymentFailed handleBack={handleBack} handleRetry={handleRetry} />

      case CARD_ERROR_CODE.PENDING_CARD_AFTER_POLL:
        return <PendingAfterPoll handleBack={handleBack} />

      case CARD_ERROR_CODE.CREATE_DEBIT_ONLY:
      case ORDER_ERROR_CODE.CARD_CREATE_DEBIT_ONLY:
      case ORDER_ERROR_CODE.CARD_CREATE_EXPIRED:
      case ORDER_ERROR_CODE.CARD_PAYMENT_EXPIRED:
        return <TryAnotherCard handleReset={handleReset} handleRetry={handleRetry} />

      case CARD_ERROR_CODE.PAYMENT_DEBIT_ONLY:
      case ORDER_ERROR_CODE.CARD_PAYMENT_DEBIT_ONLY:
        return <ProblemCollecting handleReset={handleReset} handleRetry={handleRetry} />

      default:
        return <InternalServerError handleBack={handleBack} handleRetry={handleRetry} />
    }
  }

  return <Wrapper>{renderError()}</Wrapper>
}

type Props = {
  code: unknown
  handleBack: () => void
  handleReset: () => void
  handleRetry: () => void
}

export default Error
