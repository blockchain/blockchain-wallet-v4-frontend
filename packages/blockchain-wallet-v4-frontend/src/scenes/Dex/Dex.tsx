import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { actions, selectors } from 'data'
import { notReachable } from 'utils/notReachable'

import { PageLoading } from './components'
import { useSceneResolver } from './hooks'
import { NonEligible } from './NonEligible'
import { Onboarding } from './Onboarding'
import { Swap } from './Swap'

const DEX_INTRO_VIEWED_KEY = 'dexIntroViewed'

const Dex = () => {
  const dispatch = useDispatch()
  const [scene, setScene] = useSceneResolver()

  const accounts = useSelector((state: any) =>
    selectors.coins.getCoinAccounts(state, { coins: ['ETH'], nonCustodialAccounts: true })
  )

  console.log('Dex accounts', accounts)

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
      console.log('Dex render ERROR')
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
