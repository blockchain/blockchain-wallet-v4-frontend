import React from 'react'
import styled from 'styled-components'
import { BlockchainLoader } from 'blockchain-info-components'

const Container = styled.div`
  height: 150px;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${props => props.theme['gray-1']};
`

export const Loading = () => {
  return (
    <Container>
      <BlockchainLoader height={'50px'} width={'50px'} />
    </Container>
  )
}
