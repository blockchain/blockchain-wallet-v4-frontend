import React from 'react'
import { useSelector } from 'react-redux'

import { getCoin } from 'data/components/priceChart/selectors'
import { priceTicker } from 'data/components/selectors'

import Loading from './template.loading'
import Success from './template.success'

const CoinCurrentPrice = () => {
  const coin = useSelector(getCoin) ?? 'BTC'
  const data = useSelector((state) => priceTicker.getData(state, coin))

  return data.cata({
    Failure: () => null,
    Loading: () => <Loading />,
    NotAsked: () => <Loading />,
    Success: (value) => <Success fiat={value.fiat} coin={coin} />
  })
}

export default CoinCurrentPrice
