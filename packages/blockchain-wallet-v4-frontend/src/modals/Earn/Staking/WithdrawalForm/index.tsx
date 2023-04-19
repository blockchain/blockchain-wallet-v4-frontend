import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Exchange } from '@core'
import { convertFiatToCoin } from '@core/exchange'
import DataError from 'components/DataError'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { Analytics, StakingWithdrawalFormType } from 'data/types'
import { useRemote } from 'hooks'

import { amountToCrypto, amountToFiat, maxFiat } from '../../Earn.utils'
import Loading from '../Staking.template.loading'
import { FORM_NAME } from './WithdrawalForm.model'
import { getActions, getData, getRemote } from './WithdrawalForm.selectors'
import Success from './WithdrawalForm.template.success'
import { DataType, PropsType, RemotePropsType } from './WithdrawalForm.types'

const WithdrawalForm = (props: Props) => {
  const dispatch = useDispatch()
  const { analyticsActions, earnActions, formActions } = getActions(dispatch)
  const { data, error, isLoading, isNotAsked } = useRemote(getRemote)
  const { coin, displayCoin, formErrors, formValues, walletCurrency } = useSelector(getData)
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

  const handleWithdrawal = () => {
    const { amount, fix } = formValues
    // do we want an analytics actions here
    const withdrawalAmountCrypto =
      fix === 'FIAT'
        ? convertFiatToCoin({
            coin,
            currency: walletCurrency,
            maxPrecision: 18,
            rates,
            value: amount
          })
        : amount
    earnActions.requestStakingWithdrawal({
      coin,
      formName: FORM_NAME,
      withdrawalAmountCrypto
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
