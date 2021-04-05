import React from 'react'

import { Text } from 'blockchain-info-components'

const LineItemText = props => {
  return (
    <Text color='grey900' size='16px' weight={600} lineHeight='24px' capitalize>
      {props.children}
    </Text>
  )
}

const FormattedBank = bank => {
  if (!bank || !bank.details) return 'Bank Transfer'
  const { accountNumber, bankAccountType, bankName } = bank.details

  return (
    <LineItemText>
      {bankName} {bankAccountType?.toLowerCase() || ''} {accountNumber}
    </LineItemText>
  )
}

export { FormattedBank, LineItemText }
