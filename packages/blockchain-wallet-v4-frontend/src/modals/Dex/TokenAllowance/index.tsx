import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'

import { actions, model, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { Analytics, DexSwapForm, ModalName } from 'data/types'
import { useRemote } from 'hooks'
import ModalEnhancer from 'providers/ModalEnhancer'

import Error from './error'
import TokenAllowance from './TokenAllowance'
import { NonCustodialCoinInfoType } from './types'

const { DEX_SWAP_FORM } = model.components.dex

const TokenAllowanceContainer = () => {
  const dispatch = useDispatch()
  const formValues = useSelector(selectors.form.getFormValues(DEX_SWAP_FORM)) as DexSwapForm
  const gasEstimate = useSelector(selectors.components.dex.getTokenAllowanceGasEstimate)
  const { isLoading, isNotAsked } = useRemote(selectors.components.dex.getTokenAllowanceTx)
  const nonCustodialCoinAccount = useSelector((state: RootState) =>
    selectors.coins.getCoinAccounts(state, {
      coins: ['ETH'],
      nonCustodialAccounts: true
    })
  )

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
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.DEX_SWAP_APPROVE_TOKEN_CONFIRMED,
        properties: {}
      })
    )
    dispatch(actions.components.dex.sendTokenAllowanceTx({ baseToken }))
    handleClose()
  }

  const nonCustodialCoinInfo = (nonCustodialCoinAccount?.ETH[0] || {
    address: '',
    balance: 0
  }) as NonCustodialCoinInfoType
  const { address, balance } = nonCustodialCoinInfo

  let truncatedAddress = address

  if (address?.length > 8) {
    const firstFour = address.slice(0, 4)
    const lastFour = address.slice(-4)
    truncatedAddress = `${firstFour}...${lastFour}`
  }

  if (!balance || !address) return <Error />

  return (
    <TokenAllowance
      balance={balance}
      baseToken={baseToken}
      gasEstimate={gasEstimate}
      handleApprove={handleApprove}
      handleClose={handleClose}
      isLoading={isLoading}
      isNotAsked={isNotAsked}
      truncatedAddress={truncatedAddress}
    />
  )
}

export default compose<React.ComponentType>(ModalEnhancer(ModalName.DEX_TOKEN_ALLOWANCE))(
  TokenAllowanceContainer
)
