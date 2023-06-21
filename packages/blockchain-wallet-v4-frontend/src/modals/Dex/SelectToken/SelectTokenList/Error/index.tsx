import React from 'react'
import { FormattedMessage } from 'react-intl'
import { SemanticColors, Text } from '@blockchain-com/constellation'

import { NoResultsWrapper } from './styles'

const Error = () => {
  return (
    <NoResultsWrapper>
      <Text color={SemanticColors.title} variant='body2'>
        <FormattedMessage
          id='dex.tokens.failedToLoad.title'
          defaultMessage='Unable to get tokens'
        />
      </Text>
      <Text color={SemanticColors.body} variant='paragraph1'>
        <FormattedMessage
          id='dex.tokens.failedToLoad.content'
          defaultMessage='Check internet connection or refresh to try again.'
        />
      </Text>
    </NoResultsWrapper>
  )
}

export default Error
