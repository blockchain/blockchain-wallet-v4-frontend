import React from 'react'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 5px;
  box-sizing: border-box;
`

export default (props) => (
  <Wrapper>
    <Text size='12px' weight={300} color='red'>
      {props.children}
    </Text>
  </Wrapper>
)
