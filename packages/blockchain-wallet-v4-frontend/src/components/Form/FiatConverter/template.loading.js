import React from 'react'
import styled from 'styled-components'

import { FlatLoader2 } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 400px;
  padding: 5px;
  box-sizing: border-box;
  border: 1px solid ${prop => prop.theme.grey200};
`

export default () => {
  return (
    <Wrapper>
      <FlatLoader2 width='100px' height='100px' />
    </Wrapper>
  )
}
