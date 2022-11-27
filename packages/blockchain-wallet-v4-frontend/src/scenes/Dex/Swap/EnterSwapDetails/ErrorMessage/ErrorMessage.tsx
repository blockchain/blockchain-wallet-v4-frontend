import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Text } from '@blockchain-com/constellation'
import styled from 'styled-components'

const ErrorText = styled(Text)`
  margin-top: 24px;
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.theme.red600};
  text-align: center;
`

export const ErrorMessage = () => (
  <ErrorText>
    <FormattedMessage
      id='dex.quote_failure'
      defaultMessage='Failed to obtain quote. Please refresh and try again.'
    />
  </ErrorText>
)
