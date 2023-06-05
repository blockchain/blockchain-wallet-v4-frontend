import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { actions, model, selectors } from 'data'
import type { DexSwapForm } from 'data/types'
import { useRemote } from 'hooks'

import CompleteSwap from './CompleteSwap'
import Error from './Error'

const { DEX_SWAP_FORM, ETHERSCAN_TX_URL } = model.components.dex
const NETWORK = 'ETH'
const CONFIRM_SWAP = 'CONFIRM_SWAP'
const ENTER_DETAILS = 'ENTER_DETAILS'

const CompleteSwapContainer = () => {
  const dispatch = useDispatch()
  const { data, error } = useRemote(selectors.components.dex.getSwapQuoteTx)
  const formValues = useSelector(selectors.form.getFormValues(DEX_SWAP_FORM)) as DexSwapForm
  const { baseToken, counterToken } = formValues || {}

  const goToEnterDetails = () => {
    dispatch(actions.form.reset(DEX_SWAP_FORM))
    dispatch(actions.components.dex.clearCurrentSwapQuote())
    dispatch(actions.form.change(DEX_SWAP_FORM, 'step', ENTER_DETAILS))
  }

  const goToConfirmSwap = () => {
    dispatch(actions.form.change(DEX_SWAP_FORM, 'step', CONFIRM_SWAP))
  }

  if (!data || error || !baseToken || !counterToken)
    return <Error goToConfirmSwap={goToConfirmSwap} goToEnterDetails={goToEnterDetails} />

  const onViewExplorer = () => {
    window.open(`${ETHERSCAN_TX_URL}/${data.tx}`, '_blank')
  }

  return (
    <CompleteSwap
      baseToken={baseToken}
      counterToken={counterToken}
      goToEnterDetails={goToEnterDetails}
      onViewExplorer={onViewExplorer}
    />
  )
}

export default CompleteSwapContainer
