import React from 'react'
import { FormattedMessage } from 'react-intl'
import { SemanticColors } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { media } from 'services/styles'

import { LabelType } from '../HowItWorks.types'

export const labels: LabelType[] = [
  {
    id: 'scenes.earn.active-rewards-learn.how-it-works.label.currency',
    label: (
      <FormattedMessage
        id='scenes.earn.active-rewards-learn.how-it-works.label.currency'
        defaultMessage='Currency: BTC'
      />
    )
  },
  {
    id: 'scenes.earn.active-rewards-learn.how-it-works.label.duration',
    label: (
      <FormattedMessage
        id='scenes.earn.active-rewards-learn.how-it-works.label.duration'
        defaultMessage='Duration: 1 week'
      />
    )
  },
  {
    id: 'scenes.earn.active-rewards-learn.how-it-works.label.annual-rate',
    label: (
      <FormattedMessage
        id='scenes.earn.active-rewards-learn.how-it-works.label.annual-rate'
        defaultMessage='Annual rate: 8%'
      />
    )
  },
  {
    id: 'scenes.earn.active-rewards-learn.how-it-works.label.current-price',
    label: (
      <FormattedMessage
        id='scenes.earn.active-rewards-learn.how-it-works.label.current-price'
        defaultMessage='Current price: $20,383'
      />
    )
  },
  {
    id: 'scenes.earn.active-rewards-learn.how-it-works.label.trigger-price',
    label: (
      <FormattedMessage
        id='scenes.earn.active-rewards-learn.how-it-works.label.trigger-price'
        defaultMessage='Trigger price: $22,000'
      />
    )
  }
]

export const LabelsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  margin-top: 8px;
  margin-bottom: 24px;

  ${media.laptop`
    gap: 16px;
  `}
`

export const Label = styled.div`
  padding: 4px 8px;
  border-radius: 4px;
  background-color: ${SemanticColors['background-light']};
`
