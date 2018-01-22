import React from 'react'

import { BlockchainLoader } from 'blockchain-info-components'
import ExchangeLayout from 'layouts/Exchange'

const ExchangeHistory = props => {
  return (
    <ExchangeLayout>
      <BlockchainLoader width='200px' height='200px' />
    </ExchangeLayout>
  )
}

export default ExchangeHistory
