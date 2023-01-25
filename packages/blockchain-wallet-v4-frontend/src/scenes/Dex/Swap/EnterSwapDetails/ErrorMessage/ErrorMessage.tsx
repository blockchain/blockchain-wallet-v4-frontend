import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Padding, SemanticColors, Text } from '@blockchain-com/constellation'

export const ErrorMessage = () => (
  <Padding vertical={1}>
    <Text variant='paragraph1' color={SemanticColors.error}>
      <FormattedMessage
        id='dex.quote_failure'
        defaultMessage='Failed to obtain quote. Please refresh and try again.'
      />
    </Text>
  </Padding>
)
