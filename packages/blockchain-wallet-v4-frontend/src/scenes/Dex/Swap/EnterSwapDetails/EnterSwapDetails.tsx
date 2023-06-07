import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Flex, IconAlert, Padding, SemanticColors } from '@blockchain-com/constellation'

import { actions, model, selectors } from 'data'
import { DexSwapForm, DexSwapSide, ModalName } from 'data/types'
import { usePrevious, useRemote } from 'hooks'

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
const NETWORK_TOKEN = 'ETH'

type Props = {
  walletCurrency: string
}

export const EnterSwapDetails = ({ walletCurrency }: Props) => {
  const dispatch = useDispatch()

  const [pairAnimate, setPairAnimate] = useState(false)
  const [isDetailsExpanded, setDetailsExpanded] = useState(false)

  const formValues = useSelector(selectors.form.getFormValues(DEX_SWAP_FORM)) as DexSwapForm
  const { baseToken, baseTokenAmount, counterToken, counterTokenAmount, slippage } =
    formValues || {}
  const previousBaseToken = usePrevious(baseToken)

  const {
    data: quote,
    error: quoteError,
    isLoading: isLoadingQuote
  } = useRemote(selectors.components.dex.getSwapQuote)

  const {
    data: isTokenAllowed,
    isLoading: isTokenAllowedLoading,
    isNotAsked: isTokenAllowanceNotAsked
  } = useRemote(selectors.components.dex.getTokenAllowanceStatus)

  const { isNotAsked: isTokenAllowanceTxNotAsked } = useRemote(
    selectors.components.dex.getTokenAllowanceTx
  )

  useEffect(() => {
    // resets token allowance state when user changes base token and only if token allowance tx has been called before
    if (previousBaseToken !== baseToken && !isTokenAllowanceTxNotAsked) {
      dispatch(actions.components.dex.resetTokenAllowance())
    }
  }, [baseToken, isTokenAllowanceTxNotAsked, previousBaseToken])

  useEffect(() => {
    // if baseToken exists and baseToken is not ETH, fetch token allowance
    if (baseToken && baseToken !== 'ETH') {
      dispatch(actions.components.dex.fetchTokenAllowance({ baseToken }))
    }
  }, [baseToken])

  const baseTokenBalance = useSelector(
    selectors.components.dex.getDexCoinBalanceToDisplay(baseToken)
  )
  const counterTokenBalance = useSelector(
    selectors.components.dex.getDexCoinBalanceToDisplay(counterToken)
  )

  const onViewSettings = () => {
    dispatch(actions.modals.showModal(ModalName.DEX_SWAP_SETTINGS, { origin: 'Dex' }))
  }

  const onViewTokenAllowance = () => {
    dispatch(actions.modals.showModal(ModalName.DEX_TOKEN_ALLOWANCE, { origin: 'Dex' }))
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

  const showAllowanceCheck =
    baseToken &&
    baseToken !== NETWORK_TOKEN &&
    !isTokenAllowed &&
    !isTokenAllowedLoading &&
    !isTokenAllowanceNotAsked

  return (
    <FormWrapper quoteError={quoteError}>
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

      {showAllowanceCheck ? (
        <Padding vertical={1}>
          <AllowanceCheck baseToken={baseToken} onApprove={onViewTokenAllowance} />
        </Padding>
      ) : null}

      <Button
        size='large'
        width='full'
        variant='primary'
        disabled={!quote || !!showAllowanceCheck || !!quoteError}
        onClick={onConfirmSwap}
        text={
          quoteError ? (
            <Flex alignItems='center' gap={8}>
              <IconAlert color={SemanticColors.warning} size='medium' />
              {quoteError?.title}
            </Flex>
          ) : (
            <FormattedMessage id='copy.swap' defaultMessage='Swap' />
          )
        }
      />
      {quoteError && <ErrorMessage error={quoteError?.message} />}
    </FormWrapper>
  )
}
