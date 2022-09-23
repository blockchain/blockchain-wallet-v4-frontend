import React, { useEffect } from 'react'
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

const AccountSummaryContainer = (props: OwnProps) => {
  const { coin, handleClose, showSupply, stepMetadata, walletCurrency } = props
  const { data, error, isLoading, isNotAsked } = useRemote(getData)
  const dispatch = useDispatch()
  const unsupportedCurrencies = [Currencies.TWD.code, Currencies.CLP.code]
  const isFiatCurrencySupported = !includes(walletCurrency, unsupportedCurrencies)

  useEffect(() => {
    dispatch(actions.components.interest.fetchStakingLimits())
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

  const handleDepositClick = () => {
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.WALLET_STAKING_DETAIL_DEPOSIT_CLICKED,
        properties: {
          currency: coin
        }
      })
    )
    dispatch(actions.components.interest.showStakingModal({ coin, step: 'DEPOSIT' }))
  }

  const handleRefresh = () => {
    dispatch(actions.components.interest.showStakingModal({ coin, step: 'ACCOUNT_SUMMARY' }))
  }

  const handleUpLoadDocumentation = () => {
    // confirm if this is the same for staking
    dispatch(
      actions.components.interestUploadDocument.showModal({
        origin: 'InterestUploadDocument'
      })
    )
  }

  const handleWithdrawalSupplyInformation = () => {
    dispatch(
      actions.components.interest.handleWithdrawalSupplyInformation({
        origin: 'SavingsConfirmation'
      })
    )
  }

  if (error) return <DataError onClick={handleRefresh} />
  if (!data || isLoading || isNotAsked) return <Loading />

  return isFiatCurrencySupported ? (
    <AccountSummary
      accountBalances={data.accountBalances}
      coin={coin}
      // @ts-ignore
      flagEDDInterestFileUpload={data.flagEDDInterestFileUpload}
      handleClose={handleClose}
      handleDepositClick={handleDepositClick}
      handleUpLoadDocumentation={handleUpLoadDocumentation}
      handleWithdrawalSupplyInformation={handleWithdrawalSupplyInformation}
      stakingEligible={data.stakingEligible}
      stakingLimits={data.stakingLimits}
      stakingRates={data.stakingRates}
      showSupply={showSupply}
      stepMetadata={stepMetadata}
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
