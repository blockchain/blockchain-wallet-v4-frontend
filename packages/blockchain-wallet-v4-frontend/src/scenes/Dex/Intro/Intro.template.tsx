import React from 'react'
import { IconArrowLeft, IconArrowRight, PaletteColors } from '@blockchain-com/constellation'

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
        <IconArrowLeft color={PaletteColors['blue-600']} label='step back' size='medium' />
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
        <IconArrowRight color={PaletteColors['blue-600']} label='step forward' size='medium' />
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
