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

import { Image } from 'blockchain-info-components'
import FiatDisplay from 'components/Display/FiatDisplay'
import { selectors } from 'data'
import { useRemote } from 'hooks'

import { GasFeeWrapper, ShowDetailsWrapper, Wrapper } from './styles'

type OwnProps = {
  handleDetailsToggle: () => void
  isQuoteLocked: boolean
  swapDetailsOpen: boolean
  walletCurrency: string
}

export const BaseRateAndFees = ({
  handleDetailsToggle,
  isQuoteLocked,
  swapDetailsOpen,
  walletCurrency
}: OwnProps) => {
  const { data: currentChain } = useRemote(selectors.components.dex.getCurrentChain)
  const { data: swapQuote } = useRemote(selectors.components.dex.getSwapQuote)

  return !swapQuote ? null : (
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
            {swapDetailsOpen ? (
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
  )
}
