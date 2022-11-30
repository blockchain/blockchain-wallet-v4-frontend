import React from 'react'
import { Flex, Padding } from '@blockchain-com/constellation'
import styled from 'styled-components'

const FlexContainer = styled(Flex)`
  width: 100%;
`

export const SceneWrapper = ({ children }: { children: React.ReactNode }) => (
  <FlexContainer justifyContent='center'>
    <Padding top={4}>{children}</Padding>
  </FlexContainer>
)
