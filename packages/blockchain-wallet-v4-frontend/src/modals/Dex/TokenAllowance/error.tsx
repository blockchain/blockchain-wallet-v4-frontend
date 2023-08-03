import React from 'react'
import { FormattedMessage } from 'react-intl'
import { SemanticColors, Text } from '@blockchain-com/constellation'

import { ErrorWrapper } from './styles'

const Error = () => {
  return (
    <ErrorWrapper>
      <Text color={SemanticColors.error} variant='body1'>
        <FormattedMessage
          id='dex.swap-confirmation-wallet-balance.failedToLoad'
          defaultMessage='Unable to load wallet balance.'
        />
      </Text>
    </ErrorWrapper>
  )
}

export default Error
