import React from 'react'
import { Icon } from '@blockchain-com/constellation'
import { IconArrowLeft, IconArrowRight } from '@blockchain-com/icons'

import { Button, Image, Text } from 'blockchain-info-components'

import {
  IntroStepWrapper,
  IntroWrapper,
  StepBubble,
  StepBubblesWrapper,
  steps,
  StyledIconButton,
  Wrapper
} from './Intro.model'

// TODO: translations once copy is finalized
const DexIntro = ({ handleStart, setStep, step }: Props) => (
  <Wrapper>
    <Image width='100%' height='100px' name={steps[step].imageName} />
    <IntroWrapper>
      <Text
        color='textBlack'
        lineHeight='32px'
        size='24px'
        weight={600}
        style={{ margin: '20px 0 8px' }}
      >
        {steps[step].title}
      </Text>
      <Text color='grey600' lineHeight='24px' size='16px' weight={500}>
        {steps[step].subtitle}
      </Text>
    </IntroWrapper>
    <IntroStepWrapper>
      <StyledIconButton
        data-e2e='dexIntroLeftArrow'
        nature='white-transparent'
        name=''
        onClick={() => setStep(step - 1)}
        disabled={step === 0}
      >
        <Icon label='step back' color='blue600' size='md'>
          <IconArrowLeft />
        </Icon>
      </StyledIconButton>
      <StepBubblesWrapper>
        <StepBubble active={step === 0} onClick={() => setStep(0)} />
        <StepBubble active={step === 1} onClick={() => setStep(1)} />
        <StepBubble active={step === 2} onClick={() => setStep(2)} />
      </StepBubblesWrapper>
      <StyledIconButton
        data-e2e='dexIntroRightArrow'
        nature='white-transparent'
        name=''
        onClick={() => setStep(step + 1)}
        disabled={step === 2}
      >
        <Icon label='step forward' color='blue600' size='md'>
          <IconArrowRight />
        </Icon>
      </StyledIconButton>
    </IntroStepWrapper>
    <Button data-e2e='startTrading' fullwidth jumbo nature='primary' onClick={handleStart}>
      Start Trading
    </Button>
  </Wrapper>
)

type Props = {
  handleStart: () => void
  setStep: (number) => void
  step: number
}

export default DexIntro
