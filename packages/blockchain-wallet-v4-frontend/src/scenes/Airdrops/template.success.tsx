import { Container } from 'components/Box'
import AirdropInfo from './AirdropInfo'
import React from 'react'
import StxAirdrop from './StxAirdrop'

const Success = (props) => {
  return (
    <Container>
      <AirdropInfo {...props} />
      <StxAirdrop {...props} />
    </Container>
  )
}

export default Success
