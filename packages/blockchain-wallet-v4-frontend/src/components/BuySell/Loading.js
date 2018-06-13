import React from 'react'
import styled from 'styled-components'
import { HeartbeatLoader } from 'blockchain-info-components'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50vh;
  width: 100%;
`

const Loading = () => (
  <Container>
    <HeartbeatLoader color='brand-primary' width='75px' height='75px' />
  </Container>
)

export default Loading
