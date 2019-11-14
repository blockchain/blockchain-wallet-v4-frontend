import React from 'react'

import {
  ACCOUNT_CREATION_ERROR,
  NO_FUNDS_ERROR,
  RESERVE_ERROR
} from '../validation'
import {
  NoFundsMessage,
  ReserveMessage,
  ShouldCreateAccountMessage
} from '../validationMessages'

export const ErrorBanner = ({ error }) => {
  if (error.message === NO_FUNDS_ERROR) return <NoFundsMessage {...error} />
  if (error.message === ACCOUNT_CREATION_ERROR)
    return <ShouldCreateAccountMessage {...error} />
  if (error.message === RESERVE_ERROR) return <ReserveMessage {...error} />
}
