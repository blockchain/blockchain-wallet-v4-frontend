import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Exchange } from '@core'
import DataError from 'components/DataError'
import { Analytics } from 'data/types'
import { useRemote } from 'hooks'

import { getActions, getData, getRemote } from './WithdrawalForm.selectors'
import Loading from './WithdrawalForm.template.loading'
import WithdrawalForm from './WithdrawalForm.template.success'
import { PropsType } from './WithdrawalForm.types'

const WithdrawalFormContainer = ({ handleClose }: PropsType) => {
  const dispatch = useDispatch()
  const { analyticsActions, earnActions } = getActions(dispatch)
  const { data, error, isLoading, isNotAsked } = useRemote(getRemote)
  const { coin, walletCurrency } = useSelector(getData)

  if (error) return <DataError />
  if (!data || isLoading || isNotAsked) return <Loading />

  const { activeRewardsBalance, buySellBalance, rates } = data

  const activeRewardsCryptoAmount = Exchange.convertCoinToCoin({
    coin,
    value: activeRewardsBalance
  })

  const activeRewardsFiatAmount = Exchange.displayCoinToFiat({
    rates,
    toCurrency: walletCurrency,
    value: activeRewardsCryptoAmount
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

  const handleWithdrawal = () => {
    analyticsActions.trackEvent({
      key: Analytics.WALLET_ACTIVE_REWARDS_WITHDRAW_TRANSFER_CLICKED,
      properties: {
        amount: activeRewardsCryptoAmount,
        amount_usd: activeRewardsFiatAmount,
        currency: coin,
        type: 'TRADING'
      }
    })
    earnActions.requestActiveRewardsWithdrawal({
      coin,
      withdrawalAmountCrypto: activeRewardsCryptoAmount
    })
  }

  return (
    <WithdrawalForm
      activeRewardsCryptoAmount={activeRewardsCryptoAmount}
      activeRewardsFiatAmount={activeRewardsFiatAmount}
      buySellCryptoAmount={buySellCryptoAmount}
      buySellFiatAmount={buySellFiatAmount}
      coin={coin}
      handleClose={handleClose}
      handleWithdrawal={handleWithdrawal}
    />
  )
}

export default WithdrawalFormContainer
