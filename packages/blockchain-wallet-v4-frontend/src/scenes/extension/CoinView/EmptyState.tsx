import React from 'react'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
`

const ButtonStyled = styled(Button)`
  background: #65a5ff;
  border-color: #65a5ff;
  color: ${(props) => props.theme.exchangeLogin};
`

const EmptyState = () => (
  <Wrapper>
    <div>
      <Text style={{ color: '#ffffff' }} size='14px' weight={500}>
        Receive
      </Text>
    </div>
    <ButtonStyled data-e2e=''>Add crypto</ButtonStyled>
  </Wrapper>
)

export default EmptyState
