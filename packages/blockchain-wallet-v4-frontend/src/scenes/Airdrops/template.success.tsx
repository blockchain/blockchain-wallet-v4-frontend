import React from 'react'

import { Container } from 'components/Box'

import { Props as OwnProps, SuccessStateType } from '.'
import AirdropInfo from './AirdropInfo'
import StxAirdrop from './StxAirdrop'

const Success = (props: Props) => {
  return (
    <Container>
      <AirdropInfo {...props} />
      <StxAirdrop {...props} />
    </Container>
  )
}

export type Props = OwnProps &
  SuccessStateType & {
    userDoesNotExistYet?: boolean
  }

export default Success
