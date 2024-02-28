import React from 'react'
import { useDispatch } from 'react-redux'

import { fetchErc20Data } from '@core/redux/data/eth/actions'
import { CoinType } from '@core/types'
import { actions, selectors } from 'data'
import { useRemote } from 'hooks'

import { LoadingBalance } from '../../model'
import Error from './template.error'
import Success from './template.success'

const Balance = ({ coin, coinTicker }: Props) => {
  const dispatch = useDispatch()
  const { data, hasError, isLoading, isNotAsked } = useRemote(
    selectors.balances.getCoinTotalBalance(coin)
  )

  const handleRefresh = () => {
    if (window.coins?.[coin]?.coinfig?.type.erc20Address) {
      dispatch(fetchErc20Data(coin))
    } else {
      dispatch(actions.core.data[coin].fetchData())
    }
  }

  if (isLoading || isNotAsked || typeof data !== 'number') {
    return <LoadingBalance coinTicker={coinTicker} />
  }

  if (hasError) return <Error onRefresh={handleRefresh} />

  return <Success balance={data} coin={coin} coinTicker={coinTicker} />
}

export type Props = {
  coin: CoinType
  coinTicker: string
}

export default Balance
