import React from 'react'

import { notReachable } from 'utils/notReachable'

import { PageLoading } from './components'
import { useSceneResolver } from './hooks'
import { NonEligible } from './NonEligible'
import { Onboarding } from './Onboarding'
import { Swap } from './Swap'

const DEX_INTRO_VIEWED_KEY = 'dexIntroViewed'

const Dex = () => {
  const [scene, setScene] = useSceneResolver()

  const onFinishOnboarding = () => {
    localStorage.setItem(DEX_INTRO_VIEWED_KEY, 'true')
    setScene('SWAP')
  }

  switch (scene) {
    case 'ERROR':
      // TODO: Handle error
      return null

    case 'LOADING':
      return <PageLoading />

    case 'ONBOARDING':
      return <Onboarding onClickStart={onFinishOnboarding} />

    case 'NOT_ELIGIBLE':
      return <NonEligible />

    case 'SWAP':
      return <Swap />

    default:
      return notReachable(scene)
  }
}

export default Dex
