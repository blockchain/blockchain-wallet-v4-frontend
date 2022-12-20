import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, Flex, Pager } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { SceneCard } from '../../../components'

const Space = styled.div`
  padding-top: 1.5rem;
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
    <SceneCard>
      {children}
      <Flex flexDirection='column' alignItems='center'>
        <Pager totalPages={totalSteps} selectedPage={currentStep} onChange={onSwitchStep} />
        <Space />
        <Button
          width='full'
          size='default'
          text={<FormattedMessage id='dex.onboarding.startAction' defaultMessage='Start trading' />}
          onClick={onClickStart}
        />
      </Flex>
    </SceneCard>
  )
}
