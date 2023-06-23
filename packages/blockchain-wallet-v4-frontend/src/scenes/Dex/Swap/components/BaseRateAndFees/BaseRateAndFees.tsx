import React from 'react'
import { FormattedMessage } from 'react-intl'
import {
  Flex,
  IconChevronDown,
  IconChevronUp,
  Padding,
  PaletteColors,
  SemanticColors,
  Text
} from '@blockchain-com/constellation'
import BigNumber from 'bignumber.js'

import type { DexSwapQuote } from '@core/network/api/dex'
import { Image, SpinningLoader } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { selectors } from 'data'
import { useRemote } from 'hooks'

import {
  FiatTextContainer,
  GasFeeWrapper,
  HorizontalLine,
  ShowDetailsWrapper,
  Wrapper
} from './styles'

type OwnProps = {
  handleDetailsToggle: () => void
  isDetailsOpen: boolean
  walletCurrency: string
} & (
  | {
      isQuoteLoading: true
    }
  | {
      isQuoteLoading: false
      isQuoteLocked: boolean
      swapQuote: DexSwapQuote
    }
)

export const BaseRateAndFees = ({
  handleDetailsToggle,
  isDetailsOpen,
  walletCurrency,
  ...props
}: OwnProps) => {
  const { data: currentChain } = useRemote(selectors.components.dex.getCurrentChain)

  if (props.isQuoteLoading) {
    return (
      <Wrapper>
        <Flex alignItems='center'>
          <SpinningLoader borderWidth='4px' height='20px' width='20px' />
          <Padding left={1} />
          <Text color={SemanticColors.title} variant='paragraph2'>
            <FormattedMessage defaultMessage='Fetching price...' id='copy.fetching-price' />
          </Text>
        </Flex>
        <Flex alignItems='center'>
          <GasFeeWrapper>
            <Image name='gas-icon' width='16px' height='16px' />
            <HorizontalLine />
          </GasFeeWrapper>
          <ShowDetailsWrapper>
            {isDetailsOpen ? (
              <IconChevronUp
                size='medium'
                label='hide swap details'
                color={PaletteColors['grey-400']}
                onClick={handleDetailsToggle}
              />
            ) : (
              <IconChevronDown
                size='medium'
                label='show swap details'
                color={PaletteColors['grey-400']}
                onClick={handleDetailsToggle}
              />
            )}
          </ShowDetailsWrapper>
        </Flex>
      </Wrapper>
    )
  }

  const { isQuoteLocked, swapQuote } = props
  const { buyAmount, sellAmount } = swapQuote.quote
  return props.swapQuote ? (
    <Wrapper>
      <Flex alignItems='center' gap={4}>
        <Text variant='paragraph2' color={SemanticColors.title}>
          1 {sellAmount.symbol} =
        </Text>
        <CoinDisplay
          coin={buyAmount.symbol}
          size='14px'
          color='grey900'
          cursor='inherit'
          weight={600}
          data-e2e={`${buyAmount.symbol}Balance`}
        >
          {buyAmount.amount}
        </CoinDisplay>
        <FiatTextContainer>
          (
          <FiatDisplay
            coin={buyAmount.symbol}
            size='14px'
            color='grey700'
            cursor='inherit'
            weight={500}
            data-e2e={`${buyAmount.symbol}FiatBalance`}
          >
            {buyAmount.amount}
          </FiatDisplay>
          )
        </FiatTextContainer>
      </Flex>
      {!isQuoteLocked && currentChain && (
        <Flex alignItems='center'>
          <GasFeeWrapper>
            <Image name='gas-icon' width='16px' height='16px' />
            <FiatDisplay
              color={SemanticColors.title}
              size='12px'
              weight={600}
              coin={currentChain.nativeCurrency.symbol}
              currency={walletCurrency}
            >
              {new BigNumber(swapQuote.transaction.gasLimit)
                .multipliedBy(swapQuote.transaction.gasPrice)
                .toString()}
            </FiatDisplay>
          </GasFeeWrapper>

          <ShowDetailsWrapper>
            {isDetailsOpen ? (
              <IconChevronUp
                size='medium'
                label='hide swap details'
                color={PaletteColors['grey-400']}
                onClick={handleDetailsToggle}
              />
            ) : (
              <IconChevronDown
                size='medium'
                label='show swap details'
                color={PaletteColors['grey-400']}
                onClick={handleDetailsToggle}
              />
            )}
          </ShowDetailsWrapper>
        </Flex>
      )}
    </Wrapper>
  ) : null
}
