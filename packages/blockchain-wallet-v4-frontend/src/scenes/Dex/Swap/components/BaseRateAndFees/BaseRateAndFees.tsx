import React from 'react'
import {
  Flex,
  IconChevronDown,
  IconChevronUp,
  PaletteColors,
  SemanticColors,
  Text
} from '@blockchain-com/constellation'
import BigNumber from 'bignumber.js'

import type { DexSwapQuote } from '@core/network/api/dex'
import { Image, SkeletonRectangle } from 'blockchain-info-components'
import FiatDisplay from 'components/Display/FiatDisplay'
import { selectors } from 'data'
import { useRemote } from 'hooks'

import { GasFeeWrapper, ShowDetailsWrapper, Wrapper } from './styles'

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
        <SkeletonRectangle width='250px' height='28px' />
        <SkeletonRectangle width='70px' height='28px' />
      </Wrapper>
    )
  }

  const { isQuoteLocked, swapQuote } = props
  return props.swapQuote ? (
    <Wrapper>
      <Text variant='paragraph-mono' color={SemanticColors.body}>
        1 {swapQuote.quote.sellAmount.symbol} = ~{swapQuote.quote.price.toFixed(8)}{' '}
        {swapQuote.quote.buyAmount.symbol}
      </Text>
      {!isQuoteLocked && currentChain && (
        <Flex alignItems='center'>
          <GasFeeWrapper>
            <Image name='gas-icon' width='16px' height='16px' />
            <FiatDisplay
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
