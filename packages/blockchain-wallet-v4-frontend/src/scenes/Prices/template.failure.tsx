import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

const StatusWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 120px;
  align-items: center;
  justify-content: center;
`

export default () => (
  <StatusWrapper>
    <Text weight={600} color='grey600'>
      <FormattedMessage
        id='scenes.prices.failure'
        defaultMessage='Failed to load asset prices.'
      />
    </Text>
  </StatusWrapper>
)
