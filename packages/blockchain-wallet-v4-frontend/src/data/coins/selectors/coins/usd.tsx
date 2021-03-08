import React from 'react'
import { FormattedMessage } from 'react-intl'

// retrieves introduction text for coin on its transaction page
export const getTransactionPageHeaderText = () => (
  <FormattedMessage
    id='coins.usd.intro'
    defaultMessage='Store U.S. dollars in your wallet and use it to Buy crypto.'
  />
)
