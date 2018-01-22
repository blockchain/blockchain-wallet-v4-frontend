import React from 'react'

import { Text } from 'blockchain-info-components'
import ExchangeLayout from 'layouts/Exchange'

const ExchangeHistory = props => {
  const { message } = props
  return (
    <ExchangeLayout>
      <Text>{message}</Text>
    </ExchangeLayout>
  )
}

export default ExchangeHistory
