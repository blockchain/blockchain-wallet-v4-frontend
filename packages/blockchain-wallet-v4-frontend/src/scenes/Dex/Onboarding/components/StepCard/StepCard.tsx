import React from 'react'
import { Button, Flex, Padding, Pager } from '@blockchain-com/constellation'

import { Card } from './styled'

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
