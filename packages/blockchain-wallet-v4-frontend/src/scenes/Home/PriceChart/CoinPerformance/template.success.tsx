import React from 'react'
import { useSelector } from 'react-redux'
import { PriceChange } from 'blockchain-wallet-v4-frontend/src/scenes/Transactions/model'

import { getCurrency } from '@core/redux/settings/selectors'
import { PriceChangeType } from '@core/types'

const Success = ({ priceChange }: Props) => {
  const currency = useSelector(getCurrency).getOrElse('USD')
  return <PriceChange currency={currency} priceChange={priceChange} />
}

export type Props = {
  priceChange: PriceChangeType
}

export default Success
