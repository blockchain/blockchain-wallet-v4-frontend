import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { ModalName } from 'data/types'
import { useRemote } from 'hooks'

import { getActions, getRemote } from './NoBalance.selectors'
import NoBalance from './NoBalance.template'
import Loading from './NoBalance.template.loading'
import { PropsType } from './NoBalance.types'

const NoBalanceContainer = ({ handleClose, walletCurrency }: PropsType) => {
  const dispatch = useDispatch()
  const { buySellActions, modalActions } = getActions(dispatch)
  const { data, isLoading, isNotAsked } = useRemote(getRemote)

  useEffect(() => {
    buySellActions.fetchFiatEligible(walletCurrency)
  }, [])

  if (!data || isLoading || isNotAsked) return <Loading />

  const { coin, displaySymbol, isBuySellEligible } = data

  const handleBuyClick = () => {
    buySellActions.showModal({ cryptoCurrency: coin, orderType: 'BUY', origin: 'EarnPage' })
  }

  const handleReceiveClick = () => {
    modalActions.showModal(ModalName.REQUEST_CRYPTO_MODAL, { origin: 'EarnPage' })
  }

  return (
    <NoBalance
      coin={coin}
      displaySymbol={displaySymbol}
      handleBuyClick={handleBuyClick}
      handleClose={handleClose}
      handleReceiveClick={handleReceiveClick}
      isBuySellEligible={isBuySellEligible}
    />
  )
}

export default NoBalanceContainer
