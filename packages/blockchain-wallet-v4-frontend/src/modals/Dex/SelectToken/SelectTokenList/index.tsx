import React from 'react'

import { useRemote } from 'hooks'

import Error from './Error'
import Loading from './Loading'
import { getRemote } from './selectors'
import SelectTokenList from './SelectTokenList'
import { SelectTokenListContainerProps } from './types'

const SelectTokenListContainer = ({
  onTokenSelect,
  search,
  swapSide,
  walletCurrency
}: SelectTokenListContainerProps) => {
  const { data, error, isLoading, isNotAsked } = useRemote(getRemote)

  if (error) return <Error />
  if (!data || isLoading || isNotAsked) return <Loading />

  return (
    <SelectTokenList
      // @ts-ignore
      items={data}
      onTokenSelect={onTokenSelect}
      search={search}
      swapSide={swapSide}
      walletCurrency={walletCurrency}
    />
  )
}

export default SelectTokenListContainer
