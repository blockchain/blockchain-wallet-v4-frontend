import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Padding, SemanticColors, Text } from '@blockchain-com/constellation'

import { Exchange } from '@core'
import { FiatType } from '@core/types'
import { SpinningLoader } from 'blockchain-info-components'
import { actions, model, selectors } from 'data'
import { Analytics, DexSwapForm, DexSwapSide } from 'data/types'
import { useRemote } from 'hooks'

import { FlipPairButton, FormWrapper, QuoteDetails, SwapPair, SwapPairWrapper } from '../components'
import { Header } from './Header'
import { QuoteChange } from './QuoteChange'

const { DEX_SWAP_FORM } = model.components.dex
const NETWORK = 'ETH'
type Props = {
  onClickBack: () => void
  walletCurrency: FiatType
}

export const ConfirmSwap = ({ onClickBack, walletCurrency }: Props) => {
  const [showQuoteChangeMsg, setShowQuoteChangeMsg] = useState(false)
  const [isInitialLoad, setIsInititalLoad] = useState(true)
  const dispatch = useDispatch()
  const formValues = useSelector(selectors.form.getFormValues(DEX_SWAP_FORM)) as DexSwapForm
  const { isLoading: isSwapQuoteTxLoading } = useRemote(selectors.components.dex.getSwapQuoteTx)
  const { baseToken, baseTokenAmount, counterToken, counterTokenAmount, slippage } =
    formValues || {}

  const { data: quote, isLoading: isQuoteLoading } = useRemote(
    selectors.components.dex.getSwapQuote
  )

  const { data: buySymbolRates } = useRemote((state) =>
    selectors.core.data.misc.getRatesSelector(quote?.quote.buyAmount.symbol || '', state)
  )

  const { data: sellSymbolRates } = useRemote((state) =>
    selectors.core.data.misc.getRatesSelector(quote?.quote.sellAmount.symbol || '', state)
  )

  const sendQuoteAnalytics = (analyticEvent) => {
    if (quote && buySymbolRates && sellSymbolRates) {
      const getCoinAmount = (coin, value) =>
        Number(
          Exchange.convertCoinToCoin({
            coin,
            value
          })
        )
      const getFiatAmount = (coin, value, rates) =>
        Number(
          Exchange.convertCoinToFiat({
            coin,
            currency: 'USD',
            rates,
            value
          })
        )
      const sellSymbol = quote.quote.sellAmount.symbol
      const sellAmount = quote.quote.sellAmount.amount
      const buySymbol = quote.quote.buyAmount.symbol
      const buyAmount = quote.quote.buyAmount.amount
      const buyMinAmount = quote.quote.buyAmount.minAmount
      const blockchainFeeAmount = (quote.quote.sellAmount.amount / 100) * 0.9
      const transactionGasPrice = quote.transaction.gasPrice
      const transactionGasLimit = quote.transaction.gasLimit
      const networkAmount = Number(transactionGasPrice) * Number(transactionGasLimit)

      const blockchain_fee_amount = getCoinAmount(buySymbol, blockchainFeeAmount)
      const blockchain_fee_amount_usd = getFiatAmount(
        buySymbol,
        blockchainFeeAmount,
        buySymbolRates
      )
      const expected_output_amount = getCoinAmount(buySymbol, buyAmount)
      const expected_output_amount_usd = getFiatAmount(buySymbol, buyAmount, buySymbolRates)
      const input_amount = getCoinAmount(sellSymbol, sellAmount)
      const input_amount_usd = getFiatAmount(sellSymbol, sellAmount, sellSymbolRates)
      const min_output_amount = getCoinAmount(buySymbol, buyMinAmount)
      const network_fee_amount = getCoinAmount(NETWORK, networkAmount)

      dispatch(
        actions.analytics.trackEvent({
          key: analyticEvent,
          properties: {
            blockchain_fee_amount,
            blockchain_fee_amount_usd,
            blockchain_fee_currency: buySymbol,
            expected_output_amount,
            expected_output_amount_usd,
            input_amount,
            input_amount_usd,
            input_currency: sellSymbol,
            input_network: NETWORK,
            min_output_amount,
            network_fee_amount,
            network_fee_currency: NETWORK,
            output_currency: buySymbol,
            output_network: NETWORK,
            slippage_allowed: slippage,
            venue: quote.venueType
          }
        })
      )
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsInititalLoad(false)
    }, 3000)

    sendQuoteAnalytics(Analytics.DEX_SWAP_PREVIEW_VIEWED)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  useEffect(() => {
    if (!isInitialLoad && isQuoteLoading) {
      setShowQuoteChangeMsg(true)
    }
  }, [quote, setShowQuoteChangeMsg])

  const baseTokenBalance = useSelector(
    selectors.components.dex.getDexCoinBalanceToDisplay(baseToken)
  )
  const counterTokenBalance = useSelector(
    selectors.components.dex.getDexCoinBalanceToDisplay(counterToken)
  )

  const date = quote?.date || new Date()
  const totalMs = quote?.totalMs || 0
  const minAmount = Exchange.convertCoinToCoin({
    coin: counterToken || '',
    value: quote?.quote.buyAmount.minAmount || 0
  })

  const isLoading = isQuoteLoading || isSwapQuoteTxLoading
  const isSwapDisabled = showQuoteChangeMsg || isLoading

  const onConfirmSwap = () => {
    sendQuoteAnalytics(Analytics.DEX_SWAP_CONFIRMED_CLICKED)
    dispatch(actions.components.dex.sendSwapQuote())
  }

  return (
    <FormWrapper>
      <Header date={date} onClickBack={onClickBack} totalMs={totalMs} />
      <SwapPairWrapper>
        <SwapPair
          isQuoteLocked
          swapSide={DexSwapSide.BASE}
          balance={baseTokenBalance}
          coin={baseToken}
          amount={baseTokenAmount || 0}
          walletCurrency={walletCurrency}
        />

        <FlipPairButton isQuoteLocked />

        <SwapPair
          isQuoteLocked
          swapSide={DexSwapSide.COUNTER}
          balance={counterTokenBalance}
          coin={counterToken}
          amount={counterTokenAmount || 0}
          walletCurrency={walletCurrency}
        />
      </SwapPairWrapper>
      {isQuoteLoading ? (
        <QuoteDetails
          isDetailsOpen
          walletCurrency={walletCurrency}
          slippage={slippage}
          isQuoteLoading
        />
      ) : quote ? (
        <QuoteDetails
          isDetailsOpen
          isQuoteLoading={false}
          slippage={slippage}
          swapQuote={quote}
          walletCurrency={walletCurrency}
        />
      ) : null}
      <Padding horizontal={1} bottom={1}>
        <Text color={SemanticColors.body} variant='caption1'>
          <FormattedMessage
            defaultMessage='Output is estimated. You will receive at least {amount} or the transaction will revert and assets will be returned to your wallet.'
            id='dex.confirm_swap.estimate_message'
            values={{
              amount: quote ? `${minAmount} ${counterToken}` : `-`
            }}
          />
        </Text>
      </Padding>
      {showQuoteChangeMsg && <QuoteChange setShowQuoteChangeMsg={setShowQuoteChangeMsg} />}
      <Button
        disabled={isSwapDisabled}
        size='large'
        width='full'
        variant='primary'
        onClick={onConfirmSwap}
        text={
          isLoading ? (
            <SpinningLoader height='24px' width='24px' />
          ) : (
            <FormattedMessage id='copy.confirmSwap' defaultMessage='Confirm Swap' />
          )
        }
      />
    </FormWrapper>
  )
}
