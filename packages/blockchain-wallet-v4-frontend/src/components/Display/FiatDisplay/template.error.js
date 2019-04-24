import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
`

export default () => (
  <Wrapper>
    <Text size='10px' weight={400} color='red'>
      <FormattedMessage
        id='components.fiatdisplay.error'
        defaultMessage='Failed to fetch rates'
      />
    </Text>
  </Wrapper>
)
