import React from 'react'
import { IconChevronDown, IconChevronUp, PaletteColors } from '@blockchain-com/constellation'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'

import { DexSwapQuoteResponse } from '@core/network/api/dex/types'
import { Image, SkeletonRectangle, Text } from 'blockchain-info-components'
import FiatDisplay from 'components/Display/FiatDisplay'
import { selectors } from 'data'
import { useRemote } from 'hooks'

// TODO: better way to expose props?
import type { Props } from '../../EnterSwapDetails/EnterSwapDetails'

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
  handleDetailsToggle,
  quoteLocked,
  quoteR,
  swapDetailsOpen,
  walletCurrency
}: OwnProps) => {
  const { data: currentChain } = useRemote(selectors.components.dex.getCurrentChain)
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
              {!quoteLocked && (
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
                    {swapDetailsOpen ? (
                      <IconChevronUp
                        color={PaletteColors['grey-400']}
                        label='hide swap details'
                        onClick={handleDetailsToggle}
                        size='medium'
                      />
                    ) : (
                      <IconChevronDown
                        color={PaletteColors['grey-400']}
                        label='show swap details'
                        onClick={handleDetailsToggle}
                        size='medium'
                      />
                    )}
                  </ShowDetailsWrapper>
                </RightColumn>
              )}
            </>
          )
        }
      })}
    </Wrapper>
  )
}

type OwnProps = {
  handleDetailsToggle?: () => void
  quoteLocked?: boolean
  swapDetailsOpen: boolean
} & Pick<Props, 'quoteR' | 'walletCurrency'>

export default BaseRateAndFees
