import React from 'react'
import styled from 'styled-components'

import DataError from 'components/DataError'
import { FlyoutWrapper } from 'components/Flyout'
import { CARD_ERROR_CODE } from 'data/components/buySell/model'

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

const CardError = ({ code, handleBack, handleReset, handleRetry }: Props) => {
  const renderError = () => {
    switch (code) {
      case CARD_ERROR_CODE.INSUFFICIENT_FUNDS:
        return <InsufficientFunds handleBack={handleBack} handleRetry={handleRetry} />
      case CARD_ERROR_CODE.BANK_DECLINE:
      case CARD_ERROR_CODE.ACQUIRER_DECLINE:
      case CARD_ERROR_CODE.BLOCKED_CARD_AFTER_POLL:
      case CARD_ERROR_CODE.PAYMENT_NOT_SUPPORTED:
        return <BankDecline handleBack={handleBack} handleRetry={handleRetry} />
      case CARD_ERROR_CODE.DUPLICATE:
        return <Duplicate handleBack={handleBack} />
      case CARD_ERROR_CODE.CREATE_FAILED:
      case CARD_ERROR_CODE.LINK_CARD_FAILED:
        return <CreateFailed handleBack={handleBack} handleRetry={handleRetry} />
      case CARD_ERROR_CODE.PAYMENT_FAILED:
        return <PaymentFailed handleBack={handleBack} handleRetry={handleRetry} />
      case CARD_ERROR_CODE.PENDING_CARD_AFTER_POLL:
        return <PendingAfterPoll handleBack={handleBack} />
      case CARD_ERROR_CODE.INTERNAL_SERVER_ERROR:
        return <InternalServerError handleBack={handleBack} handleRetry={handleRetry} />
      case CARD_ERROR_CODE.CREATE_DEBIT_ONLY:
        return <TryAnotherCard handleReset={handleReset} handleRetry={handleRetry} />
      case CARD_ERROR_CODE.PAYMENT_DEBIT_ONLY:
        return <ProblemCollecting handleReset={handleReset} handleRetry={handleRetry} />
      case CARD_ERROR_CODE.BLOCKCHAIN_DECLINE:
      default:
        return <DataError message={{ message: `${code}` }} />
    }
  }

  return <Wrapper>{renderError()}</Wrapper>
}

type Props = {
  code: number | string
  handleBack: () => void
  handleReset: () => void
  handleRetry: () => void
}

export default CardError
