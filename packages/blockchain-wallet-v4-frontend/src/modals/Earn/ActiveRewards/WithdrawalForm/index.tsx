import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import DataError from 'components/DataError'
import { Analytics } from 'data/types'
import { useRemote } from 'hooks'

import { amountToCrypto, amountToFiat } from '../conversions'
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

  const activeRewardsCryptoAmount = amountToCrypto({
    amount: activeRewardsBalance,
    coin
  })
  const activeRewardsFiatAmount = amountToFiat({
    amount: activeRewardsBalance,
    coin,
    rates,
    walletCurrency
  })
  const buysellCryptoAmount = amountToCrypto({
    amount: buySellBalance,
    coin
  })
  const buysellFiatAmount = amountToFiat({
    amount: buySellBalance,
    coin,
    rates,
    walletCurrency
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
      buysellCryptoAmount={buysellCryptoAmount}
      buysellFiatAmount={buysellFiatAmount}
      coin={coin}
      handleClose={handleClose}
      handleWithdrawal={handleWithdrawal}
    />
  )
}

export default WithdrawalFormContainer
