import React from 'react'
import { FormattedMessage } from 'react-intl'
import { SemanticColors, Text } from '@blockchain-com/constellation'

import { NoResultsWrapper } from '../components/styles'

export const Failed = () => {
  return (
    <NoResultsWrapper>
      <Text color={SemanticColors.error} variant='body1'>
        <FormattedMessage id='dex.tokens.failedToLoad' defaultMessage='Unable to get tokens' />
      </Text>
    </NoResultsWrapper>
  )
}
