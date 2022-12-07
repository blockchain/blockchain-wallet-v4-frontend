import React from 'react'
import { SemanticColors, Text } from '@blockchain-com/constellation'

import { Card, CardContainer, cardsData, Wrapper } from './Cards.model'
import { CardType } from './Cards.types'

const Cards = () => (
  <Wrapper>
    {cardsData.map(({ description, id, title }: CardType, i: number) => (
      <CardContainer key={id} isFullWidth={i === 0}>
        <Card>
          <Text color={SemanticColors.title} variant='title3'>
            {title}
          </Text>
          <Text color={SemanticColors.body} variant='paragraph1'>
            {description}
          </Text>
        </Card>
      </CardContainer>
    ))}
  </Wrapper>
)

export default Cards
