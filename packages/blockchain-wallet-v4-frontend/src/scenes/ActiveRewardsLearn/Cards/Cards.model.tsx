import React from 'react'
import { FormattedMessage } from 'react-intl'
import { SemanticColors } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { media } from 'services/styles'

import { CardContainerType, CardType } from './Cards.types'

export const cardsData: CardType[] = [
  {
    description: (
      <FormattedMessage
        id='scenes.earn.active-rewards-learn.cards.description-1'
        defaultMessage='Active Rewards lets you earn rewards by forecasting the price of crypto. Payouts settle every Friday at 8:00AM UTC.'
      />
    ),
    id: 'scenes.earn.active-rewards-learn.cards.title-1',
    title: (
      <FormattedMessage
        id='scenes.earn.active-rewards-learn.cards.title-1'
        defaultMessage='What is Active Rewards?'
      />
    )
  },
  {
    description: (
      <FormattedMessage
        id='scenes.earn.active-rewards-learn.cards.description-2'
        defaultMessage='Active Rewards can offer a higher yield than Passive Rewards, Staking Rewards, or simply holding crypto.'
      />
    ),
    id: 'scenes.earn.active-rewards-learn.cards.title-2',
    title: (
      <FormattedMessage
        id='scenes.earn.active-rewards-learn.cards.title-2'
        defaultMessage='What are the benefits?'
      />
    )
  },
  {
    description: (
      <FormattedMessage
        id='scenes.earn.active-rewards-learn.cards.description-3'
        defaultMessage='While Active Rewards gives a rewards component which is fixed on a weekly basis, market movements may affect your nominal crypto balance at the end of the lock-up period.'
      />
    ),
    id: 'scenes.earn.active-rewards-learn.cards.title-3',
    title: (
      <FormattedMessage
        id='scenes.earn.active-rewards-learn.cards.title-3'
        defaultMessage='What are the risks?'
      />
    )
  }
]

export const Wrapper = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  margin: 24px 0;
`
export const CardContainer = styled.div<CardContainerType>`
  display: flex;
  flex: 1 0 200px;
  flex-direction: column;

  ${media.laptop`
    flex-basis: ${({ isFullWidth }) => (isFullWidth ? '100%' : '200px')};
  `}
`

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 24px 16px;
  background-color: ${SemanticColors['background-light']};
  border-radius: 8px;
  height: 100%;
`
