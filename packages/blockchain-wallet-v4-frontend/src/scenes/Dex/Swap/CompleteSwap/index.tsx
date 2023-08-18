import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { actions, model, selectors } from 'data'
import { Analytics, DexSwapForm, DexSwapSteps } from 'data/types'
import { useRemote } from 'hooks'

import CompleteSwap from './CompleteSwap'
import Error from './Error'

const { DEX_SWAP_FORM, ETHERSCAN_TX_URL } = model.components.dex

const CompleteSwapContainer = () => {
  const dispatch = useDispatch()
  const { data, error } = useRemote(selectors.components.dex.getSwapQuoteTx)
  const formValues = useSelector(selectors.form.getFormValues(DEX_SWAP_FORM)) as DexSwapForm
  const { baseToken, counterToken } = formValues || {}

  const goToEnterDetails = () => {
    dispatch(actions.form.reset(DEX_SWAP_FORM))
    dispatch(actions.components.dex.clearCurrentSwapQuote())
    dispatch(actions.form.change(DEX_SWAP_FORM, 'step', DexSwapSteps.ENTER_DETAILS))
  }

  const onSwappingViewed = () => {
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.DEX_SWAPPING_VIEWED,
        properties: {}
      })
    )
  }

  const onDexSwapFailViewed = () => {
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.DEX_SWAP_FAILED_VIEWED,
        properties: {}
      })
    )
  }

  const goToConfirmSwap = () => {
    dispatch(actions.form.change(DEX_SWAP_FORM, 'step', DexSwapSteps.CONFIRM_SWAP))
  }

  if (!data || error || !baseToken || !counterToken)
    return (
      <Error
        goToConfirmSwap={goToConfirmSwap}
        goToEnterDetails={goToEnterDetails}
        onDexSwapFailViewed={onDexSwapFailViewed}
      />
    )

  const onViewExplorer = () => {
    window.open(`${ETHERSCAN_TX_URL}/${data.tx}`, '_blank')
  }

  return (
    <CompleteSwap
      baseToken={baseToken}
      counterToken={counterToken}
      goToEnterDetails={goToEnterDetails}
      onSwappingViewed={onSwappingViewed}
      onViewExplorer={onViewExplorer}
    />
  )
}

export default CompleteSwapContainer
