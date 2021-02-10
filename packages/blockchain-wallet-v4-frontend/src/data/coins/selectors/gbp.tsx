import { FormattedMessage } from 'react-intl'
import React from 'react'

// retrieves introduction text for coin on its transaction page
export const getTransactionPageHeaderText = () => (
  <FormattedMessage
    id='coins.gbp.intro'
    defaultMessage='Store British pounds in your wallet and use it to Buy crypto.'
  />
)