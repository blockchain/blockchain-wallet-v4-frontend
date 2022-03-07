import React from 'react'
import styled from 'styled-components'

import DataError from 'components/DataError'
import { FlyoutWrapper } from 'components/Flyout'

import CardErrorCreateFailed from './CardErrorCreateFailed'
import CardErrorDuplicate from './CardErrorDuplicate'

const Wrapper = styled(FlyoutWrapper)`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  text-align: center;
`

enum CARD_ERROR_CODE {
  INSUFFICIENT_FUNDS = 10000,
  BANK_DECLINE = 10001,
  DUPLICATE = 10002,
  BLOCKCHAIN_DECLINE = 10003,
  ACQUIRER_DECLINE = 10004,
  PAYMENT_NOT_SUPPORTED = 10005,
  CREATE_FAILED = 10006,
  PAYMENT_FAILED = 10007
}

const Failure = ({ code, handleBack, /* handleReset, */ handleRetry }: Props) => {
  const renderError = () => {
    switch (code) {
      // case CARD_ERROR_CODE.INSUFFICIENT_FUNDS:
      //   return <></>
      // case CARD_ERROR_CODE.BANK_DECLINE:
      //   return <></>
      case CARD_ERROR_CODE.DUPLICATE:
        return <CardErrorDuplicate handleBack={handleBack} />
      // case CARD_ERROR_CODE.BLOCKCHAIN_DECLINE:
      //   return <></>
      // case CARD_ERROR_CODE.ACQUIRER_DECLINE:
      //   return <></>
      // case CARD_ERROR_CODE.PAYMENT_NOT_SUPPORTED:
      //   return <></>
      case CARD_ERROR_CODE.CREATE_FAILED:
        return <CardErrorCreateFailed handleBack={handleBack} handleRetry={handleRetry} />
      // case CARD_ERROR_CODE.PAYMENT_FAILED:
      //   return <></>
      default:
        return <DataError message={{ message: `${code}` }} />
    }
  }

  return <Wrapper>{renderError()}</Wrapper>
}

type Props = {
  code: number
  handleBack: () => void
  // handleReset: () => void
  handleRetry: () => void
}

export default Failure
