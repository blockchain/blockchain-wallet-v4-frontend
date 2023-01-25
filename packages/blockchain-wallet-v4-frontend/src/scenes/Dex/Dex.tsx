import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { actions } from 'data'
import { notReachable } from 'utils/helpers'

import { PageLoading } from './components'
import { useSceneResolver } from './hooks'
import { NonEligible } from './NonEligible'
import { Onboarding } from './Onboarding'
import { Swap } from './Swap'

const DEX_INTRO_VIEWED_KEY = 'dexIntroViewed'

const Dex = () => {
  const dispatch = useDispatch()
  const [scene, setScene] = useSceneResolver()

  // clear data on exiting DEX app
  useEffect(() => {
    return () => {
      dispatch(actions.components.dex.clearCurrentSwapQuote())
    }
  }, [])

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
