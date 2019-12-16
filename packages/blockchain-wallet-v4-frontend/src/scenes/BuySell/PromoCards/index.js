import { FormattedMessage } from 'react-intl'
import { Text } from 'blockchain-info-components'
import React from 'react'
import styled from 'styled-components'

import ContinueCoinifyCard from './ContinueCoinifyCard'
import LaunchPitCard from './LaunchPitCard'
import LearnMoreCard from './LearnMoreCard'

const Wrapper = styled.div`
  width: 100%;
  height: 90%;
  padding: 0;
  box-sizing: border-box;
`

const Title = styled(Text)`
  width: 300px;
  margin-bottom: 1rem;
`

const CardsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const PromoCardContainer = props => {
  const { currentTier, hasTokenOrTrades, handleShowCoinify } = props

  return (
    <Wrapper>
      <Title size='32px' weight={600} color='grey800'>
        <FormattedMessage
          id='scenes.buysell.title.buy_sell_crypto'
          defaultMessage='Buy & Sell Crypto'
        />
      </Title>
      <Text weight={500} color='grey400'>
        <FormattedMessage
          id='scenes.buysell.subtitle.buy_sell_crypto'
          defaultMessage="The quickest way to get today's top crypto."
        />
      </Text>
      <CardsWrapper>
        <LearnMoreCard />
        <LaunchPitCard />
        <ContinueCoinifyCard
          currentTier={currentTier}
          handleShowCoinify={handleShowCoinify}
          hasTokenOrTrades={hasTokenOrTrades}
        />
      </CardsWrapper>
    </Wrapper>
  )
}

export default PromoCardContainer
