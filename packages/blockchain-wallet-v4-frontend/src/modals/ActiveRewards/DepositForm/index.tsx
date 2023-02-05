import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Exchange } from '@core'
import DataError from 'components/DataError'
import { Analytics } from 'data/types'
import { useRemote } from 'hooks'

import Loading from '../ActiveRewards.template.loading'
import { amountToFiat, maxFiat } from '../conversions'
import { FORM_NAME } from './DepositForm.constants'
import { getActions, getData, getRemote } from './DepositForm.selectors'
import Success from './DepositForm.template.success'
import { DataType, PropsType, RemoteType } from './DepositForm.types'

const DepositForm = ({ coin }: PropsType) => {
  const dispatch = useDispatch()
  const { analyticsActions, earnActions, formActions } = getActions(dispatch)
  const { data, error, isLoading, isNotAsked } = useRemote(getRemote)
  const {
    displayCoin,
    earnDepositLimits,
    formErrors,
    underSanctionsMessage,
    values,
    walletCurrency
  }: DataType = useSelector(getData)

  const handleInitializeDepositForm = () => {
    earnActions.initializeActiveRewardsDepositForm({ coin, currency: walletCurrency })
  }

  const handleRefresh = () => {
    handleInitializeDepositForm()
  }

  useEffect(() => {
    handleInitializeDepositForm()
    analyticsActions.trackEvent({
      key: Analytics.WALLET_ACTIVE_REWARDS_DEPOSIT_VIEWED,
      properties: {
        currency: coin
      }
    })
    earnActions.setCoinDisplay({ isAmountDisplayedInCrypto: true })
    earnActions.fetchEDDDepositLimits({ currency: walletCurrency })
  }, [])

  if (error)
    return underSanctionsMessage ? (
      <DataError onClick={handleRefresh} message={{ message: underSanctionsMessage }} />
    ) : (
      <DataError onClick={handleRefresh} />
    )

  if (!data || isLoading || isNotAsked) {
    return <Loading />
  }

  const {
    activeRewardsRates,
    depositFee,
    earnEDDStatus: { eddNeeded, eddPassed, eddSubmitted },
    isActiveRewardsWithdrawalEnabled,
    payment,
    rates
  }: RemoteType = data

  const { coinfig } = window.coins[coin]
  const currencySymbol = Exchange.getSymbol(walletCurrency) as string
  const depositAmount = (values && values.depositAmount) || '0'
  const isCustodial =
    values && values?.earnDepositAccount && values.earnDepositAccount.type === 'CUSTODIAL'
  const maxDepositFiat = maxFiat(earnDepositLimits.maxFiat, walletCurrency)
  const fromAccountType = isCustodial ? 'TRADING' : 'USERKEY'
  const depositAmountFiat = amountToFiat({ amount: depositAmount, coin, rates, walletCurrency })

  const depositAmountError =
    typeof formErrors.depositAmount === 'string' && formErrors.depositAmount
  const isErc20 = !!coinfig.type.erc20Address
  const insufficientEth =
    payment &&
    isErc20 &&
    !!coinfig.type.erc20Address &&
    // @ts-ignore
    !payment.isSufficientEthForErc20
  const isEDDRequired = eddNeeded && !eddPassed && !eddSubmitted

  const handleFormSubmit = () => {
    earnActions.submitDepositForm({ formName: FORM_NAME })

    analyticsActions.trackEvent({
      key: Analytics.WALLET_ACTIVE_REWARDS_DEPOSIT_TRANSFER_CLICKED,
      properties: {
        amount: depositAmount,
        amount_usd: depositAmountFiat,
        currency: coin,
        type: fromAccountType
      }
    })
  }

  const handleAmountChanged = (e) => {
    analyticsActions.trackEvent({
      key: Analytics.ACTIVE_REWARDS_CLIENT_DEPOSIT_AMOUNT_ENTERED,
      properties: {
        amount: Number(e.target.value),
        amount_currency: coin,
        currency: walletCurrency,
        from_account_type: fromAccountType,
        input_amount: Number(values.depositAmount),
        rate: Number(activeRewardsRates[coin])
      }
    })
  }

  const handleMaxAmountClicked = () => {
    earnActions.handleTransferMaxAmountClick({
      amount: displayCoin ? earnDepositLimits.maxCoin : earnDepositLimits.maxFiat,
      formName: FORM_NAME
    })

    analyticsActions.trackEvent({
      key: Analytics.ACTIVE_REWARDS_CLIENT_DEPOSIT_MAX_AMOUNT_CLICKED,
      properties: {
        amount_currency: coin,
        currency: walletCurrency,
        from_account_type: fromAccountType
      }
    })
  }

  const handleMinAmountClicked = () => {
    earnActions.handleTransferMinAmountClick({
      amount: displayCoin ? earnDepositLimits.minCoin : earnDepositLimits.minFiat,
      formName: FORM_NAME
    })

    analyticsActions.trackEvent({
      key: Analytics.ACTIVE_REWARDS_CLIENT_DEPOSIT_MIN_AMOUNT_CLICKED,
      properties: {
        amount_currency: coin,
        currency: walletCurrency,
        from_account_type: fromAccountType
      }
    })
  }

  const handleChangeDepositAmount = () => {
    formActions.change(
      FORM_NAME,
      'depositAmount',
      displayCoin ? earnDepositLimits.maxCoin : earnDepositLimits.maxFiat
    )
  }

  const handleDisplayToggle = (isCoin: boolean) => {
    if (isCoin === displayCoin) return

    formActions.clearFields(FORM_NAME, false, false, 'depositAmount')
    earnActions.setCoinDisplay({ isAmountDisplayedInCrypto: isCoin })
  }

  return (
    <Success
      coin={coin}
      currencySymbol={currencySymbol}
      depositAmountError={depositAmountError}
      depositFee={depositFee}
      displayCoin={displayCoin}
      displaySymbol={coinfig.displaySymbol}
      earnDepositLimits={earnDepositLimits}
      handleAmountChanged={handleAmountChanged}
      handleChangeDepositAmount={handleChangeDepositAmount}
      handleDisplayToggle={handleDisplayToggle}
      handleFormSubmit={handleFormSubmit}
      handleMaxAmountClicked={handleMaxAmountClicked}
      handleMinAmountClicked={handleMinAmountClicked}
      insufficientEth={insufficientEth}
      isActiveRewardsWithdrawalEnabled={isActiveRewardsWithdrawalEnabled}
      isCustodial={isCustodial}
      isEDDRequired={isEDDRequired}
      isErc20={isErc20}
      maxDepositFiat={maxDepositFiat}
      rates={rates}
      walletCurrency={walletCurrency}
    />
  )
}

export default DepositForm
