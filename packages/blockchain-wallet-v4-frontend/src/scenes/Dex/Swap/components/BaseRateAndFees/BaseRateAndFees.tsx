import React from 'react'
import { Icon } from '@blockchain-com/constellation'
import { IconChevronDown, IconChevronUp } from '@blockchain-com/icons'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'

import { DexSwapQuoteResponse } from '@core/network/api/dex/types'
import { Image, SkeletonRectangle, Text } from 'blockchain-info-components'
import FiatDisplay from 'components/Display/FiatDisplay'

import type { Props } from '../../Swap'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 24px 16px;
`
const RightColumn = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`
const GasFeeWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 20px;
  padding: 4px 8px;
  margin-right: 8px;
  border-radius: 4px;
  background-color: ${(props) => props.theme.grey000};
  > :first-child {
    margin-right: 6px;
  }
`
const ShowDetailsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  &:hover {
    cursor: pointer;
  }
`

const BaseRateAndFees = ({
  currentChain,
  handleDetailsToggle,
  quoteR,
  swapDetailsOpen,
  walletCurrency
}: OwnProps) => {
  return (
    <Wrapper>
      {quoteR?.cata({
        Failure: () => null,
        Loading: () => (
          <>
            <SkeletonRectangle height='28px' width='25%' bgColor='white' />
            <SkeletonRectangle height='28px' width='25%' bgColor='white' />
          </>
        ),
        NotAsked: () => null,
        Success: (val: DexSwapQuoteResponse) => {
          // TODO: rewrite to support multi-leg quotes
          const quote = val?.quotes?.[0]
          const txLeg = val?.txs?.[0]
          return (
            <>
              <Text weight={500} size='14px' color='textBlack'>
                1 {quote?.sellAmount?.symbol} = ~{parseFloat(quote?.price || '0').toFixed(8)}{' '}
                {quote?.buyAmount?.symbol}
              </Text>
              <RightColumn>
                <GasFeeWrapper>
                  <Image name='gas-icon' width='16px' height='16px' />
                  <FiatDisplay
                    size='12px'
                    weight={600}
                    coin={currentChain?.nativeCurrency.symbol}
                    currency={walletCurrency}
                  >
                    {new BigNumber(txLeg?.gasLimit || 0)
                      .multipliedBy(txLeg?.gasPrice || 0)
                      .toString()}
                  </FiatDisplay>
                </GasFeeWrapper>
                <ShowDetailsWrapper>
                  {swapDetailsOpen && (
                    <Icon label='hide swap details' color='grey400' size='md'>
                      <IconChevronUp onClick={handleDetailsToggle} />
                    </Icon>
                  )}
                  {!swapDetailsOpen && (
                    <Icon label='show swap details' color='grey400' size='md'>
                      <IconChevronDown onClick={handleDetailsToggle} />
                    </Icon>
                  )}
                </ShowDetailsWrapper>
              </RightColumn>
            </>
          )
        }
      })}
    </Wrapper>
  )
}

type OwnProps = {
  handleDetailsToggle: () => void
  swapDetailsOpen: boolean
} & Pick<Props, 'currentChain' | 'quoteR' | 'walletCurrency'>

export default BaseRateAndFees
