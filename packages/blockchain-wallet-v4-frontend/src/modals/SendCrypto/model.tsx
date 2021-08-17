import React from 'react'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

export const SEND_FORM = '@SEND_CRYPTO'

const StyledLabel = styled.label`
  width: 100%;
  display: flex;
  align-items: center;
  padding-left: 40px;
  margin-top: 24px;
  box-sizing: border-box;
`

const Border = styled.div`
  background: ${(props) => props.theme.grey000};
  height: 1px;
  flex: 1;
  margin-left: 8px;
`

export const FormLabelWithBorder: React.FC<{}> = ({ children }) => {
  return (
    <StyledLabel>
      <Text size='12px' weight={600} color='black'>
        {children}
      </Text>
      <Border />
    </StyledLabel>
  )
}
