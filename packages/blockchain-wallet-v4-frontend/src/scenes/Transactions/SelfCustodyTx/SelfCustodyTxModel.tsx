import React from 'react'
import { FormattedMessage } from 'react-intl'

import { IngestedSelfCustodyType } from '@core/network/api/coin/types'

export const TransactionType = ({
  txType
}: {
  txType: IngestedSelfCustodyType['movements'][0]['type']
}) => {
  switch (txType) {
    case 'RECEIVED':
      return (
        <FormattedMessage
          id='components.form.tabmenutransactionstatus.received'
          defaultMessage='Received'
        />
      )
    case 'SENT':
      return (
        <FormattedMessage
          id='components.form.tabmenutransactionstatus.sent'
          defaultMessage='Sent'
        />
      )
    default:
      return <></>
  }
}
