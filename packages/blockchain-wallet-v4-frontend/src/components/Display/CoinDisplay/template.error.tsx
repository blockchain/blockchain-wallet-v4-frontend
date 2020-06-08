import { Text } from 'blockchain-info-components'
import React from 'react'
import styled from 'styled-components'

import media from 'services/ResponsiveService'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 5px;
  box-sizing: border-box;
`
const ErrorText = styled(Text)<{ mobileSize: string }>`
  font-weight: 500;
  color: ${props => props.theme.red600};
  font-size: ${props => props.mobileSize};
  ${media.atLeastMobile`
    font-size: ${props => props.size};
  `}
`

export default props => (
  <Wrapper>
    <ErrorText {...props}>{props.children}</ErrorText>
  </Wrapper>
)
