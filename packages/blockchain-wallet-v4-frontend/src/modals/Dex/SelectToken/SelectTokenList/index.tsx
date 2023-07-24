import React from 'react'
import { useSelector } from 'react-redux'

import { model, selectors } from 'data'
import { DexSwapForm } from 'data/types'

import SelectTokenList from './SelectTokenList'
import { SelectTokenListContainerProps } from './types'

const { DEX_SWAP_FORM } = model.components.dex

const SelectTokenListContainer = ({
  onTokenSelect,
  search,
  swapSide,
  walletCurrency
}: SelectTokenListContainerProps) => {
  const tokens = useSelector(selectors.components.dex.getTokens)
  const formValues = useSelector(selectors.form.getFormValues(DEX_SWAP_FORM)) as DexSwapForm
  const { baseToken, counterToken } = formValues

  return (
    <SelectTokenList
      baseToken={baseToken}
      counterToken={counterToken}
      // @ts-ignore data loses it's type
      items={tokens}
      onTokenSelect={onTokenSelect}
      search={search}
      swapSide={swapSide}
      walletCurrency={walletCurrency}
    />
  )
}

export default SelectTokenListContainer
