import React from 'react'
import { Button, Flex, Padding, Pager } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { media } from 'services/styles'

const Card = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  width: 568px;
  height: 512px;
  padding: 1.5rem;

  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.grey100};
  background-color: ${({ theme }) => theme.white};

  ${media.tablet`
    width: 100%;
  `}

  ${media.mobile`
    padding: 20px;
  `}
`

type Props = {
  children: React.ReactNode
  currentStep: number
  onClickStart: () => void
  onSwitchStep: (nextStep: number) => void
  totalSteps: number
}

export const StepCard = ({
  children,
  currentStep,
  onClickStart,
  onSwitchStep,
  totalSteps
}: Props) => {
  return (
    <Card>
      {children}
      <Flex flexDirection='column' alignItems='center'>
        <Pager totalPages={totalSteps} selectedPage={currentStep} onChange={onSwitchStep} />
        <Padding top={1.5} />
        <Button width='full' size='default' text='Start trading' onClick={onClickStart} />
      </Flex>
    </Card>
  )
}
