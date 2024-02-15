import React from 'react'

import { getTotalWalletBalancesSorted } from 'data/balances/selectors'
import { useRemote } from 'hooks'

import Loading from './template.loading'
import Success from './template.success'

const CoinList = () => {
  const {
    data: coinList,
    hasError,
    isLoading,
    isNotAsked
  } = useRemote(getTotalWalletBalancesSorted)

  if (isLoading) return <Loading />

  if (isNotAsked || !coinList) return <Loading />
  if (hasError || coinList.length === 0) return null
  return <Success coinList={coinList} />
}

export default CoinList
