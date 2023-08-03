import React from 'react'
import styled from 'styled-components'

import { BankDWStepType } from 'data/components/brokerage/types'

import { Props as OwnProps, SuccessStateType } from '.'
import { InstructionDetails } from './InstructionDetails'

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
`

const Success = (props: Props) => {
  const onClickBack = () => {
    props.brokerageActions.setDWStep({
      dwStep: BankDWStepType.DEPOSIT_METHODS
    })
  }

  return (
    <Wrapper>
      <InstructionDetails onClickBack={onClickBack} {...props} />
    </Wrapper>
  )
}

type Props = OwnProps & SuccessStateType

export default Success
