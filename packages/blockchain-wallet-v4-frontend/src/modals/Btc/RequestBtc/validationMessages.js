import { FormattedMessage } from 'react-intl'
import React from 'react'

export const InvalidAmountMessageMin = () => (
  <FormattedMessage
    id='modals.requestbtc.amountnotminmessage'
    defaultMessage='Must be greater than 0'
  />
)

export const InvalidAmountMessageMax = () => (
  <FormattedMessage
    id='modals.requestbtc.amountnotmaxmessage'
    defaultMessage='Cannot exceed 21,000,000'
  />
)
