import React from 'react'
import { useSelector } from 'react-redux'

import { model, selectors } from 'data'
import { DexSwapForm } from 'data/types'
import { useRemote } from 'hooks'

import Error from './Error'
import Loading from './Loading'
import { getRemote } from './selectors'
import SelectTokenList from './SelectTokenList'
import { SelectTokenListContainerProps } from './types'

const { DEX_SWAP_FORM } = model.components.dex

const SelectTokenListContainer = ({
  onTokenSelect,
  search,
  swapSide,
  walletCurrency
}: SelectTokenListContainerProps) => {
  const { data, error, isLoading, isNotAsked } = useRemote(getRemote)
  const formValues = useSelector(selectors.form.getFormValues(DEX_SWAP_FORM)) as DexSwapForm
  const { baseToken, counterToken } = formValues

  if (error) return <Error />
  if (!data || isLoading || isNotAsked) return <Loading />

  return (
    <SelectTokenList
      baseToken={baseToken}
      counterToken={counterToken}
      // @ts-ignore data loses it's type
      items={data}
      onTokenSelect={onTokenSelect}
      search={search}
      swapSide={swapSide}
      walletCurrency={walletCurrency}
    />
  )
}

export default SelectTokenListContainer
