import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'

import { actions, model, selectors } from 'data'
import { DexSwapForm, ModalName } from 'data/types'
import { useRemote } from 'hooks'
import ModalEnhancer from 'providers/ModalEnhancer'

import TokenAllowance from './TokenAllowance.template'

const { DEX_SWAP_FORM } = model.components.dex

const TokenAllowanceContainer = () => {
  const dispatch = useDispatch()
  const formValues = useSelector(selectors.form.getFormValues(DEX_SWAP_FORM)) as DexSwapForm
  const gasEstimate = useSelector(selectors.components.dex.getTokenAllowanceGasEstimate)
  const { isLoading, isNotAsked } = useRemote(selectors.components.dex.getTokenAllowanceTx)

  useEffect(() => {
    if (formValues.baseToken) {
      dispatch(actions.components.dex.pollTokenAllowanceTx({ baseToken: formValues.baseToken }))
    }

    return () => {
      dispatch(actions.components.dex.stopPollTokenAllowanceTx())
    }
  }, [formValues])

  if (!formValues?.baseToken) return null
  const { baseToken } = formValues

  const handleClose = () => {
    dispatch(actions.modals.closeModal())
  }

  const handleApprove = () => {
    dispatch(actions.components.dex.sendTokenAllowanceTx({ baseToken }))
    handleClose()
  }

  return (
    <TokenAllowance
      baseToken={baseToken}
      gasEstimate={gasEstimate}
      handleApprove={handleApprove}
      handleClose={handleClose}
      isLoading={isLoading}
      isNotAsked={isNotAsked}
    />
  )
}

export default compose<React.ComponentType>(ModalEnhancer(ModalName.DEX_TOKEN_ALLOWANCE))(
  TokenAllowanceContainer
)
