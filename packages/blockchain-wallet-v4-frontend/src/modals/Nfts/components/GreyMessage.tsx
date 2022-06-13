import React from 'react'
import styled from 'styled-components'

import { Flex } from 'components/Flex'

const Wrapper = styled.div`
  background: ${(props) => props.theme.grey000};
  padding: 16px;
  border-radius: 8px;
`

const GreyMessage: React.FC<Props> = ({ children }) => {
  return (
    <Wrapper>
      <Flex gap={8} flexDirection='column'>
        {children}
      </Flex>
    </Wrapper>
  )
}

type Props = {}

export default GreyMessage
