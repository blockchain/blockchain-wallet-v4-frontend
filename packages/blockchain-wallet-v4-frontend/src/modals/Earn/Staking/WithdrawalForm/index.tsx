import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Exchange } from '@core'
import DataError from 'components/DataError'
import { Analytics } from 'data/types'
import { useRemote } from 'hooks'

import { amountToFiat, maxFiat } from '../../Earn.utils'
import Loading from '../Staking.template.loading'
import { FORM_NAME } from './WithdrawalForm.model'
import { getActions, getData, getRemote } from './WithdrawalForm.selectors'
import Success from './WithdrawalForm.template.success'
import { DataType, PropsType, RemoteType } from './WithdrawalForm.types'

const WithdrawalForm = (props: OwnProps) => {
  const dispatch = useDispatch()
  const { analyticsActions, earnActions, formActions } = getActions(dispatch)
  const { data, error, isLoading, isNotAsked } = useRemote(getRemote)
  const { coin, walletCurrency } = useSelector(getData)
  const { handleClose } = props

  // @ts-ignore
  const { accountBalances, buySellBalance, rates }: RemoteType = data

  const stakingCryptoAmount = Exchange.convertCoinToCoin({
    coin,
    value: accountBalances.earningBalance || '0'
  })

  const stakingFiatAmount = Exchange.displayCoinToFiat({
    rates,
    toCurrency: walletCurrency,
    value: stakingCryptoAmount
  })

  return (
    <Success
      accountBalances={accountBalances}
      coin={coin}
      walletCurrency={walletCurrency}
      handleClose={handleClose}
      stakingCryptoAmount={stakingCryptoAmount}
      stakingFiatAmount={stakingFiatAmount}
    />
  )
}

export type OwnProps = {
  handleClose: () => void
}

export default WithdrawalForm
