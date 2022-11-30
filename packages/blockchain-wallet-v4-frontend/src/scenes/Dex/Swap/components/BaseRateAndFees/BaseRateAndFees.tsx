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
  const { data: swapQuoteResponse } = useRemote(selectors.components.dex.getSwapQuote)

  const quote = swapQuoteResponse ? (swapQuoteResponse as any)?.quotes_?.[0] : null

  // FIXME: Pass data from remote response
  const txLeg = (swapQuoteResponse as any)?.txs_?.[0] || {}

  const quoteDetails = {
    buyAmount: {
      symbol: quote?.buyAmount_.symbol_ || ''
    },
    price: quote?.price_ ? parseFloat(quote?.price_) : 0,
    sellAmount: {
      symbol: quote?.sellAmount_.symbol_ || ''
    }
  }

  return (
    <Wrapper>
      <Text variant='paragraph-mono' color={SemanticColors.body}>
        1 {quoteDetails.sellAmount.symbol} = ~{quoteDetails.price.toFixed(8)}{' '}
        {quoteDetails.buyAmount.symbol}
      </Text>
      {!isQuoteLocked && (
        <Flex alignItems='center'>
          <GasFeeWrapper>
            <Image name='gas-icon' width='16px' height='16px' />
            <FiatDisplay
              size='12px'
              weight={600}
              coin={currentChain?.nativeCurrency.symbol}
              currency={walletCurrency}
            >
              {new BigNumber(txLeg.gasLimit_).multipliedBy(txLeg.gasPrice_).toString()}
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
