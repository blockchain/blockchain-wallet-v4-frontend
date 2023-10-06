import React from 'react'
import { useSelector } from 'react-redux'

import { priceTicker } from 'data/components/selectors'
import { getPriceChart } from 'data/preferences/selectors'

import Loading from './template.loading'
import Success from './template.success'

const CoinCurrentPrice = () => {
  const { coin = 'BTC' } = useSelector(getPriceChart)
  const data = useSelector((state) => priceTicker.getData(state, coin))

  return data.cata({
    Failure: () => null,
    Loading: () => <Loading />,
    NotAsked: () => <Loading />,
    Success: (value) => <Success fiat={value.fiat} coin={coin} />
  })
}

export default CoinCurrentPrice
