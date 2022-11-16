import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { model } from 'data'

import { SceneWrapper, Slide, StepCard } from './components'

const { DEX_INTRO_VIEWED_KEY } = model.components.dex

const slides: React.ComponentProps<typeof Slide>[] = [
  {
    description: (
      <FormattedMessage
        id='dex.onboarding.welcome.description'
        defaultMessage='A decentralized exchange (DEX) is a peer-to-peer marketplace that lets you swap cryptocurrencies.'
      />
    ),
    image: 'dex-onboarding-slide-welcome',
    title: (
      <FormattedMessage id='dex.onboarding.welcome.title' defaultMessage='Welcome to the DEX' />
    )
  },
  {
    description: (
      <FormattedMessage
        id='dex.onboarding.swap.description'
        defaultMessage='Swap BTC, ETH, USDT, and more.'
      />
    ),
    image: 'dex-onboarding-slide-swap',
    title: <FormattedMessage id='dex.onboarding.swap.title' defaultMessage='Swap 1000+ Tokens' />
  },
  {
    description: (
      <FormattedMessage
        id='dex.onboarding.funds.title'
        defaultMessage='When you trade on a DEX, you keep access to your private keys — it’s “your keys, your crypto.” Blockchain.com doesn’t hold these funds.'
      />
    ),
    image: 'dex-onboarding-slide-funds',
    title: (
      <FormattedMessage
        id='dex.onboarding.funds.title'
        defaultMessage='Keep control of your funds'
      />
    )
  }
]

export const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState<number>(0)

  const onClickStart = () => {
    localStorage.setItem(DEX_INTRO_VIEWED_KEY, 'true')
  }

  return (
    <SceneWrapper>
      <StepCard
        totalSteps={3}
        currentStep={currentStep}
        onClickStart={onClickStart}
        onSwitchStep={setCurrentStep}
      >
        <Slide {...slides[currentStep]} />
      </StepCard>
    </SceneWrapper>
  )
}
