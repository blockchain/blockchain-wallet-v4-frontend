import React, { ReactNode } from 'react'
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

const Error = (props: { children: ReactNode }) => (
  <Wrapper>
    <Text size='12px' weight={400} color='red600'>
      {props.children}
    </Text>
  </Wrapper>
)

export default Error
