import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Padding } from '@blockchain-com/constellation'

import { actions, model, selectors } from 'data'
import { DexSwapForm, DexSwapSide, ModalName } from 'data/types'
import { useRemote } from 'hooks'

import { AllowanceCheck } from '../AllowanceCheck'
import {
  BaseRateAndFees,
  FlipPairButton,
  FormWrapper,
  QuoteDetails,
  SwapPair,
  SwapPairWrapper
} from '../components'
import { ErrorMessage } from './ErrorMessage'
import { Header } from './Header'

const { DEX_SWAP_FORM } = model.components.dex

type Props = {
  walletCurrency: string
}

export const EnterSwapDetails = ({ walletCurrency }: Props) => {
  const dispatch = useDispatch()
  const [isApproved, setIsApproved] = useState(false)

  const [pairAnimate, setPairAnimate] = useState(false)
  const [isDetailsExpanded, setDetailsExpanded] = useState(false)

  const formValues = useSelector(selectors.form.getFormValues(DEX_SWAP_FORM)) as DexSwapForm
  const { baseToken, baseTokenAmount, counterToken, counterTokenAmount, slippage } =
    formValues || {}

  const {
    data: quote,
    hasError: hasQuoteError,
    isLoading: isLoadingQuote
  } = useRemote(selectors.components.dex.getSwapQuote)

  const baseTokenBalance = useSelector(
    selectors.components.dex.getDexCoinBalanceToDisplay(baseToken)
  )
  const counterTokenBalance = useSelector(
    selectors.components.dex.getDexCoinBalanceToDisplay(counterToken)
  )

  const onViewSettings = () => {
    dispatch(actions.modals.showModal(ModalName.DEX_SWAP_SETTINGS, { origin: 'Dex' }))
  }

  const onTokenSelect = (swapSide: DexSwapSide) => {
    dispatch(actions.modals.showModal(ModalName.DEX_TOKEN_SELECT, { origin: 'Dex', swapSide }))
  }

  const onDetailsToggle = () => {
    setDetailsExpanded(!isDetailsExpanded)
  }

  const onConfirmSwap = () => {
    dispatch(actions.form.change(DEX_SWAP_FORM, 'step', 'CONFIRM_SWAP'))
  }

  const onFlipPairClick = () => {
    setPairAnimate(true)
    // delay form change to assist in smoother animation
    setTimeout(() => {
      dispatch(actions.form.change(DEX_SWAP_FORM, 'isFlipping', true))
      dispatch(actions.form.change(DEX_SWAP_FORM, 'baseToken', counterToken))
      dispatch(actions.form.change(DEX_SWAP_FORM, 'counterToken', baseToken))
      dispatch(actions.form.change(DEX_SWAP_FORM, 'counterTokenAmount', baseTokenAmount))
      dispatch(actions.form.change(DEX_SWAP_FORM, 'baseTokenAmount', counterTokenAmount))
      dispatch(actions.form.change(DEX_SWAP_FORM, 'isFlipping', false))
      setPairAnimate(false)
    }, 400)
  }

  return (
    <FormWrapper>
      <Header onClickSettings={onViewSettings} />
      <SwapPairWrapper>
        {formValues.baseToken ? (
          <SwapPair
            swapSide='BASE'
            animate={pairAnimate}
            isQuoteLocked={false}
            balance={baseTokenBalance}
            coin={baseToken}
            amount={baseTokenAmount || 0}
            walletCurrency={walletCurrency}
            onTokenSelect={onTokenSelect}
          />
        ) : (
          <SwapPair
            swapSide='BASE'
            animate={pairAnimate}
            isQuoteLocked={false}
            walletCurrency={walletCurrency}
            onTokenSelect={onTokenSelect}
          />
        )}

        <FlipPairButton isQuoteLocked={false} onClick={onFlipPairClick} />

        {formValues.counterToken ? (
          <SwapPair
            swapSide='COUNTER'
            animate={pairAnimate}
            isQuoteLocked={false}
            balance={counterTokenBalance}
            coin={counterToken}
            amount={counterTokenAmount || 0}
            walletCurrency={walletCurrency}
            onTokenSelect={onTokenSelect}
          />
        ) : (
          <SwapPair
            swapSide='COUNTER'
            animate={pairAnimate}
            isQuoteLocked={false}
            walletCurrency={walletCurrency}
            onTokenSelect={onTokenSelect}
          />
        )}
      </SwapPairWrapper>

      {isLoadingQuote ? (
        <BaseRateAndFees
          handleDetailsToggle={onDetailsToggle}
          isDetailsOpen={isDetailsExpanded}
          walletCurrency={walletCurrency}
          isQuoteLoading
        />
      ) : quote ? (
        <BaseRateAndFees
          handleDetailsToggle={onDetailsToggle}
          isDetailsOpen={isDetailsExpanded}
          walletCurrency={walletCurrency}
          isQuoteLoading={false}
          isQuoteLocked={false}
          swapQuote={quote}
        />
      ) : null}

      {isDetailsExpanded ? (
        isLoadingQuote ? (
          <QuoteDetails
            handleSettingsClick={onViewSettings}
            isDetailsOpen={isDetailsExpanded}
            walletCurrency={walletCurrency}
            slippage={slippage}
            isQuoteLoading
          />
        ) : quote ? (
          <QuoteDetails
            handleSettingsClick={onViewSettings}
            isDetailsOpen={isDetailsExpanded}
            walletCurrency={walletCurrency}
            slippage={slippage}
            isQuoteLoading={false}
            swapQuote={quote}
          />
        ) : null
      ) : null}

      {baseToken && counterToken && quote ? (
        <Padding vertical={1}>
          <AllowanceCheck coinSymbol={baseToken} onApprove={() => setIsApproved(true)} />
        </Padding>
      ) : null}

      <Button
        size='large'
        width='full'
        variant='primary'
        disabled={!quote || !isApproved}
        onClick={onConfirmSwap}
        text={<FormattedMessage id='copy.swap' defaultMessage='Swap' />}
      />

      {/* TODO: Check if we have other errors to display the same way and make it generic */}
      {hasQuoteError ? <ErrorMessage /> : null}
    </FormWrapper>
  )
}
