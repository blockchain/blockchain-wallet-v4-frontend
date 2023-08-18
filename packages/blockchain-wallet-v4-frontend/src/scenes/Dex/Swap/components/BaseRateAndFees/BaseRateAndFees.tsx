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
import FiatDisplay from 'components/Display/FiatDisplay'
import { selectors } from 'data'
import { DexSwapSide } from 'data/types'
import { useRemote } from 'hooks'

import { GasFeeWrapper, HorizontalLine, ShowDetailsWrapper, Wrapper } from './styles'

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
      swapSideType: DexSwapSide
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

  const { isQuoteLocked, swapQuote, swapSideType } = props
  const isFetchedFromBase = swapSideType === DexSwapSide.BASE
  const {
    buyAmount: { symbol: buySymbol },
    price,
    sellAmount: { symbol: sellSymbol }
  } = swapQuote.quote
  const counterPrice = isFetchedFromBase ? price.toFixed(8) : (1 / price).toFixed(8)

  return props.swapQuote ? (
    <Wrapper>
      <Text variant='paragraph2' color={SemanticColors.title}>
        1 {sellSymbol} = ~{counterPrice} {buySymbol}
      </Text>
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
