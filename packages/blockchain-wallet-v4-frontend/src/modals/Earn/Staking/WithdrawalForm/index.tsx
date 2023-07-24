import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Exchange } from '@core'
import { convertFiatToCoin } from '@core/exchange'
import DataError from 'components/DataError'
import { useRemote } from 'hooks'

import Loading from '../Staking.template.loading'
import { FORM_NAME } from './WithdrawalForm.model'
import { getActions, getData, getRemote } from './WithdrawalForm.selectors'
import Success from './WithdrawalForm.template.success'
import { RemotePropsType } from './WithdrawalForm.types'

const WithdrawalForm = (props: Props) => {
  const dispatch = useDispatch()
  const { analyticsActions, earnActions, formActions } = getActions(dispatch)
  const { data, error, isLoading, isNotAsked } = useRemote(getRemote)
  const { coin, displayCoin, formErrors, formValues, walletCurrency } = useSelector(getData)
  const { handleClose } = props

  if (!data || isLoading || isNotAsked) {
    return <Loading />
  }

  if (error) {
    return <DataError />
  }
  const { accountBalance, buySellBalance, rates, stakingLimits }: RemotePropsType = data

  const stakingCryptoAmount = Exchange.convertCoinToCoin({
    coin,
    value: accountBalance.earningBalance
  })

  const stakingFiatAmount = Exchange.displayCoinToFiat({
    rates,
    toCurrency: walletCurrency,
    value: stakingCryptoAmount
  })

  const buySellCryptoAmount = Exchange.convertCoinToCoin({
    coin,
    value: buySellBalance || '0'
  })

  const buySellFiatAmount = Exchange.displayCoinToFiat({
    rates,
    toCurrency: walletCurrency,
    value: buySellCryptoAmount
  })

  const { unbondingDays } = stakingLimits[coin]

  const handleWithdrawal = () => {
    const { amount, fix } = formValues
    earnActions.requestStakingWithdrawal({
      coin,
      fix,
      formName: FORM_NAME,
      walletCurrency,
      withdrawalAmount: amount
    })
  }

  return (
    <Success
      accountBalance={accountBalance}
      buySellCryptoAmount={buySellCryptoAmount}
      buySellFiatAmount={buySellFiatAmount}
      coin={coin}
      displayCoin={displayCoin}
      formErrors={formErrors}
      formValues={formValues}
      rates={rates}
      walletCurrency={walletCurrency}
      handleClose={handleClose}
      handleWithdrawal={handleWithdrawal}
      stakingCryptoAmount={stakingCryptoAmount}
      stakingFiatAmount={stakingFiatAmount}
      unbondingDays={unbondingDays}
    />
  )
}

export type Props = {
  handleClose: () => void
}

export default WithdrawalForm
