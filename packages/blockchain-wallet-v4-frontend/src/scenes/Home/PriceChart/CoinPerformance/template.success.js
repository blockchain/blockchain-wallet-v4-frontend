import React from 'react'
import { Exchange } from 'blockchain-wallet-v4/src'
import * as Currency from 'blockchain-wallet-v4/src/exchange/currency'
import { Text } from 'blockchain-info-components'

const Success = ({ currency, priceChange, pricePercentageChange }) => {
  return (
    <Text>
      {Exchange.getSymbol(currency) + Currency.formatFiat(priceChange)} (%
      {Currency.formatFiat(pricePercentageChange)})
    </Text>
  )
}

export default Success
