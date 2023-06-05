import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import { Button, Padding, SemanticColors, Text } from '@blockchain-com/constellation'

import { Exchange } from '@core'
import { SkeletonRectangle } from 'blockchain-info-components'
import { model, selectors } from 'data'
import type { DexSwapForm } from 'data/types'
import { useRemote } from 'hooks'

import { FlipPairButton, FormWrapper, QuoteDetails, SwapPair, SwapPairWrapper } from '../components'
import { Header } from './Header'
import { QuoteChange } from './QuoteChange'

const { DEX_SWAP_FORM } = model.components.dex

type Props = {
  onClickBack: () => void
  walletCurrency: string
}

export const ConfirmSwap = ({ onClickBack, walletCurrency }: Props) => {
  const [showQuoteChangeMsg, setShowQuoteChangeMsg] = useState(false)
  const [isInitialLoad, setIsInititalLoad] = useState(true)
  const formValues = useSelector(selectors.form.getFormValues(DEX_SWAP_FORM)) as DexSwapForm
  const { baseToken, baseTokenAmount, counterToken, counterTokenAmount, slippage } =
    formValues || {}

  const { data: quote, isLoading: isQuoteLoading } = useRemote(
    selectors.components.dex.getSwapQuote
  )

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsInititalLoad(false)
    }, 3000)

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

  const isSwapDisabled = showQuoteChangeMsg || isQuoteLoading

  const onConfirmSwap = () => null

  return (
    <FormWrapper>
      <Header date={date} onClickBack={onClickBack} totalMs={totalMs} />
      <SwapPairWrapper>
        <SwapPair
          isQuoteLocked
          swapSide='BASE'
          balance={baseTokenBalance}
          coin={baseToken}
          amount={baseTokenAmount || 0}
          walletCurrency={walletCurrency}
        />

        <FlipPairButton isQuoteLocked />

        <SwapPair
          isQuoteLocked
          swapSide='COUNTER'
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
              amount: quote ? (
                `${minAmount} ${counterToken}`
              ) : (
                <SkeletonRectangle bgColor='white' height='39px' width='75px' />
              )
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
        text={<FormattedMessage id='copy.confirmSwap' defaultMessage='Confirm Swap' />}
      />
    </FormWrapper>
  )
}
