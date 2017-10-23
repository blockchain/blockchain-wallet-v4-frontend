import React from 'react'
import styled from 'styled-components'
import { Icon } from 'blockchain-info-components'

const Container = styled.div`
 margin-top: 5px;
`
const WhatsNew = () => (
  <Container>
    <Icon name='bell' size='14px' color='white' />
  </Container>
)

export default WhatsNew
