import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { includes } from 'ramda'

import Currencies from '@core/exchange/currencies'
import { CoinType, FiatType } from '@core/types'
import DataError from 'components/DataError'
import { actions } from 'data'
import { Analytics, EarnStepMetaData } from 'data/types'
import { useRemote } from 'hooks'

import Loading from '../Staking.template.loading'
import { getData } from './AccountSummary.selectors'
import AccountSummary from './AccountSummary.template.success'
import Unsupported from './AccountSummary.template.unsupported'

const PENDING_TRANSACTIONS_MAX = 4

const AccountSummaryContainer = (props: OwnProps) => {
  const [isTransactionsToggled, setIsTransactionsToggled] = useState<boolean>(false)
  const [isCoinDisplayed, setIsCoinDisplayed] = useState<boolean>(true)
  const [isBalanceDropdownToggled, setIsBalanceDropdownToggled] = useState<boolean>(false)
  const { coin, handleClose, showSupply, stepMetadata, walletCurrency } = props
  const { data, error, isLoading, isNotAsked } = useRemote(getData)
  const dispatch = useDispatch()
  const unsupportedCurrencies = [Currencies.TWD.code, Currencies.CLP.code]
  const isFiatCurrencySupported = !includes(walletCurrency, unsupportedCurrencies)

  useEffect(() => {
    dispatch(actions.components.interest.fetchStakingLimits())
    dispatch(actions.components.interest.fetchPendingStakingTransactions({ coin }))
  }, [])

  useEffect(() => {
    if (isFiatCurrencySupported) {
      dispatch(
        actions.analytics.trackEvent({
          key: Analytics.WALLET_STAKING_DETAIL_VIEWED,
          properties: {
            currency: coin
          }
        })
      )
    }
  }, [coin, isFiatCurrencySupported])

  useEffect(() => {
    const isTransactionsToggledAutomatically: boolean | undefined =
      data &&
      data.pendingTransactions.length < PENDING_TRANSACTIONS_MAX &&
      data.pendingTransactions.length > 0

    if (isTransactionsToggledAutomatically) {
      setIsTransactionsToggled(true)
    } else {
      setIsTransactionsToggled(false)
    }
  }, [data?.pendingTransactions])

  const handleEDDSubmitInfo = () => {
    dispatch(actions.components.interestUploadDocument.showModal({ origin: 'EarnPage' }))
  }

  const handleRefresh = () => {
    dispatch(actions.components.interest.showStakingModal({ coin, step: 'ACCOUNT_SUMMARY' }))
  }

  const handleTransactionsToggled = () => {
    setIsTransactionsToggled(!isTransactionsToggled)
  }

  const handleCoinToggled = () => {
    setIsCoinDisplayed(!isCoinDisplayed)
  }

  const handleBalanceDropdown = () => {
    setIsBalanceDropdownToggled(!isBalanceDropdownToggled)
  }

  if (error) return <DataError onClick={handleRefresh} />
  if (!data || isLoading || isNotAsked) return <Loading />

  const {
    accountBalances,
    earnEDDStatus: { eddNeeded, eddPassed, eddSubmitted },
    hasBalance,
    isStakingWithdrawalEnabled,
    pendingTransactions,
    stakingEligible,
    stakingLimits,
    stakingRates,
    totalBondingDeposits
  } = data

  const handleDepositClick = () => {
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.WALLET_STAKING_DETAIL_DEPOSIT_CLICKED,
        properties: {
          currency: coin
        }
      })
    )
    dispatch(
      actions.components.interest.showStakingModal({
        coin,
        step: hasBalance ? 'DEPOSIT' : 'NO_BALANCE'
      })
    )
  }

  const handleWithdrawClick = () => {
    dispatch(
      actions.components.interest.showStakingModal({
        coin,
        step: 'WTIHDRAWAL'
      })
    )
  }

  const isEDDRequired = eddNeeded && !eddSubmitted && !eddPassed

  return isFiatCurrencySupported ? (
    <AccountSummary
      accountBalances={accountBalances}
      coin={coin}
      handleBalanceDropdown={handleBalanceDropdown}
      handleClose={handleClose}
      handleCoinToggled={handleCoinToggled}
      handleDepositClick={handleDepositClick}
      handleEDDSubmitInfo={handleEDDSubmitInfo}
      handleTransactionsToggled={handleTransactionsToggled}
      handleWithdrawClick={handleWithdrawClick}
      isBalanceDropdownToggled={isBalanceDropdownToggled}
      isCoinDisplayed={isCoinDisplayed}
      isEDDRequired={isEDDRequired}
      isStakingWithdrawalEnabled={isStakingWithdrawalEnabled}
      isTransactionsToggled={isTransactionsToggled}
      pendingTransactions={pendingTransactions}
      stakingEligible={stakingEligible}
      stakingLimits={stakingLimits}
      stakingRates={stakingRates}
      showSupply={showSupply}
      stepMetadata={stepMetadata}
      totalBondingDeposits={totalBondingDeposits}
      walletCurrency={walletCurrency}
    />
  ) : (
    <Unsupported handleClose={handleClose} walletCurrency={walletCurrency} />
  )
}

export type OwnProps = {
  coin: CoinType
  handleClose: () => void
  showSupply: boolean
  stepMetadata: EarnStepMetaData
  walletCurrency: FiatType
}

export default AccountSummaryContainer
