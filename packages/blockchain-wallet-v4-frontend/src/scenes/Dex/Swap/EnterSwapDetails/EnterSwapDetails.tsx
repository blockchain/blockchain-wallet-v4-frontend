import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Flex, IconAlert, Padding, PaletteColors } from '@blockchain-com/constellation'

import { Exchange } from '@core'
import { actions, model, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import {
  Analytics,
  DexSwapForm,
  DexSwapSide,
  DexSwapSideFields,
  DexSwapSteps,
  ModalName,
  SwapAccountType
} from 'data/types'
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
import { ButtonContainer } from './styles'

const { DEX_SWAP_FORM } = model.components.dex
const NATIVE_TOKEN = 'ETH'

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
  const swapSideType = useSelector(selectors.components.dex.getSwapSideType)

  const showAllowanceCheck =
    baseToken &&
    baseToken !== NATIVE_TOKEN &&
    !isTokenAllowed &&
    !isTokenAllowedLoading &&
    !isTokenAllowanceNotAsked
  const isInsufficientBalance = !!quoteError?.title.includes('Balance')
  const isInsufficientGas = !!quoteError?.message.includes('gas')

  const baseTokenAccount = useSelector((state: RootState) => {
    const token = isInsufficientGas ? NATIVE_TOKEN : baseToken
    if (!token) return undefined

    const accounts = selectors.coins.getCoinAccounts(state, {
      coins: [token],
      nonCustodialAccounts: true
    })

    return accounts[token] && accounts[token][0]
  }) as SwapAccountType | undefined

  const onViewSettings = () => {
    dispatch(actions.modals.showModal(ModalName.DEX_SWAP_SETTINGS, { origin: 'Dex' }))
  }

  const onViewTokenAllowance = () => {
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.DEX_SWAP_APPROVE_TOKEN_CLICKED,
        properties: {}
      })
    )
    dispatch(actions.modals.showModal(ModalName.DEX_TOKEN_ALLOWANCE, { origin: 'Dex' }))
  }

  const onTokenSelect = (swapSide: DexSwapSide) => {
    dispatch(actions.modals.showModal(ModalName.DEX_TOKEN_SELECT, { origin: 'Dex', swapSide }))
  }

  const onDetailsToggle = () => {
    // when user expands quote toggle
    if (!isDetailsExpanded) {
      dispatch(
        actions.analytics.trackEvent({
          key: Analytics.DEX_SWAP_DETAIL_EXPANDED,
          properties: {}
        })
      )
    }
    setDetailsExpanded(!isDetailsExpanded)
  }

  const onConfirmSwap = () => {
    dispatch(actions.form.change(DEX_SWAP_FORM, 'step', DexSwapSteps.CONFIRM_SWAP))
  }

  const handleMaxClicked = () => {
    if (!baseToken || !baseTokenBalance || baseToken === NATIVE_TOKEN) return

    const maxAmount = Exchange.convertCoinToCoin({
      coin: baseToken,
      value: Number(baseTokenBalance)
    })

    dispatch(actions.form.change(DEX_SWAP_FORM, `${DexSwapSideFields.BASE}Amount`, maxAmount))
  }

  const onDepositMore = () => {
    dispatch(
      actions.modals.showModal(
        ModalName.REQUEST_CRYPTO_MODAL,
        {
          origin: 'Dex'
        },
        { account: baseTokenAccount, coin: isInsufficientBalance ? NATIVE_TOKEN : baseToken }
      )
    )
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
            swapSide={DexSwapSide.BASE}
            animate={pairAnimate}
            handleMaxClicked={handleMaxClicked}
            isQuoteLocked={false}
            balance={baseTokenBalance}
            coin={baseToken}
            amount={baseTokenAmount || 0}
            walletCurrency={walletCurrency}
            onTokenSelect={onTokenSelect}
          />
        ) : (
          <SwapPair
            amount={baseTokenAmount || 0}
            swapSide={DexSwapSide.BASE}
            animate={pairAnimate}
            isQuoteLocked={false}
            walletCurrency={walletCurrency}
            onTokenSelect={onTokenSelect}
          />
        )}

        <FlipPairButton isQuoteLocked={false} onClick={onFlipPairClick} />

        {formValues.counterToken ? (
          <SwapPair
            swapSide={DexSwapSide.COUNTER}
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
            swapSide={DexSwapSide.COUNTER}
            animate={pairAnimate}
            isQuoteLocked={false}
            amount={counterTokenAmount || 0}
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
          swapSideType={swapSideType}
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

      {quoteError && (
        <ErrorMessage
          coin={baseToken}
          error={quoteError?.message}
          isInsufficientBalance={isInsufficientBalance}
        />
      )}
      {showAllowanceCheck && !quoteError ? (
        <Padding bottom={1.5}>
          <AllowanceCheck baseToken={baseToken} onApprove={onViewTokenAllowance} />
        </Padding>
      ) : null}
      <ButtonContainer quoteError={quoteError}>
        <Button
          size='large'
          width='full'
          variant='primary'
          disabled={!quote || !!showAllowanceCheck}
          onClick={onConfirmSwap}
          text={
            quoteError ? (
              <Flex alignItems='center' gap={8}>
                <IconAlert color={PaletteColors['orange-400']} size='medium' />
                {isInsufficientBalance ? (
                  <FormattedMessage
                    id='dex.enter-swap-details.button.insufficient'
                    defaultMessage='Insufficient {token}'
                    values={{ token: baseToken }}
                  />
                ) : (
                  quoteError?.title
                )}
              </Flex>
            ) : (
              <FormattedMessage id='copy.swap' defaultMessage='Swap' />
            )
          }
        />
        {quoteError && quoteError?.title.includes('Insufficient') && (
          <Button
            size='large'
            width='full'
            variant='minimal'
            onClick={onDepositMore}
            text={
              <FormattedMessage
                id='dex.enter-swap-details.deposit-more'
                defaultMessage='Deposit more {token}'
                values={{ token: isInsufficientGas ? NATIVE_TOKEN : baseToken }}
              />
            }
          />
        )}
      </ButtonContainer>
    </FormWrapper>
  )
}
