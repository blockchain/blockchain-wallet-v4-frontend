import React from 'react'

import { convertBaseCoinToCoin } from 'services/ConversionService'

const EthDisplay = props => {
  const { amount } = props
  return <div>{convertBaseCoinToCoin('ETH', 'ETH', amount)}</div>
}

export default EthDisplay
