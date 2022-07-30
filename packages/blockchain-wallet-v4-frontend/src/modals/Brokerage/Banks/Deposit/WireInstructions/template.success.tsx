import React from 'react'
import styled from 'styled-components'

import { Props as OwnProps, SuccessStateType } from '.'
import InstructionDetails from './InstructionDetails'

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
`

const Success = (props: Props) => {
  return (
    <Wrapper>
      <InstructionDetails {...props} />
    </Wrapper>
  )
}

type Props = OwnProps & SuccessStateType

export default Success
