import React from 'react'
import { SemanticColors, Text } from '@blockchain-com/constellation'

import { LabelType } from '../HowItWorks.types'
import { Label, labels, LabelsContainer } from './Labels.model'

const Labels = () => (
  <LabelsContainer>
    {labels.map(({ id, label }: LabelType) => (
      <Label key={id}>
        <Text color={SemanticColors.title} variant='caption2'>
          {label}
        </Text>
      </Label>
    ))}
  </LabelsContainer>
)

export default Labels
