import React from 'react'
import { FormattedMessage } from 'react-intl'
import { SemanticColors, Text } from '@blockchain-com/constellation'

import { NoResultsWrapper } from '../components/styles'

export const Empty = ({ search }: { search: string }) => {
  return (
    <NoResultsWrapper>
      <Text color={SemanticColors.body} variant='body1'>
        <FormattedMessage
          id='dex.tokens.notFound'
          defaultMessage='No results found for {search}'
          values={{ search }}
        />
      </Text>
    </NoResultsWrapper>
  )
}
