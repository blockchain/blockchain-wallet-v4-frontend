import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 400px;
  border: 1px solid ${props => props.theme['gray-2']};
`

export default (props) => (
  <Wrapper>
    <Text size='12px' weight={300} color='red'>
      <FormattedMessage id='scenes.exchange.shapeshift.error' defaultMessage='An error has occurred. Please try again.' />
    </Text>
  </Wrapper>
)
