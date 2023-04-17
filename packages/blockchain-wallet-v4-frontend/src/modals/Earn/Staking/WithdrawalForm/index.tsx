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
import { DataType, PropsType, RemotePropsType } from './WithdrawalForm.types'

const WithdrawalForm = (props: OwnProps) => {
  const dispatch = useDispatch()
  const { analyticsActions, earnActions, formActions } = getActions(dispatch)
  const { data, error, isLoading, isNotAsked } = useRemote(getRemote)
  const { coin, formValues, walletCurrency } = useSelector(getData)
  const { handleClose } = props
  // @ts-ignore
  const { accountBalance, buySellBalance, rates, stakingLimits }: RemotePropsType = data

  const stakingCryptoAmount = Exchange.convertCoinToCoin({
    coin,
    value: accountBalance.earningBalance || '0'
  })

  const stakingFiatAmount = Exchange.displayCoinToFiat({
    rates,
    toCurrency: walletCurrency,
    value: stakingCryptoAmount
  })

  const buySellCryptoAmount = Exchange.convertCoinToCoin({
    coin,
    value: buySellBalance
  })

  const buySellFiatAmount = Exchange.displayCoinToFiat({
    rates,
    toCurrency: walletCurrency,
    value: buySellCryptoAmount
  })

  const { unbondingDays } = stakingLimits[coin]

  return (
    <Success
      buySellCryptoAmount={buySellCryptoAmount}
      buySellFiatAmount={buySellFiatAmount}
      coin={coin}
      formValues={formValues}
      rates={rates}
      walletCurrency={walletCurrency}
      handleClose={handleClose}
      stakingCryptoAmount={stakingCryptoAmount}
      stakingFiatAmount={stakingFiatAmount}
      unbondingDays={unbondingDays}
    />
  )
}

export type OwnProps = {
  handleClose: () => void
}

export default WithdrawalForm
