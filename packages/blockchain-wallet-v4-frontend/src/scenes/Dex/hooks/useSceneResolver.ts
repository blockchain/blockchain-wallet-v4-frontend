import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { actions, selectors } from 'data'
import { DexScenes } from 'data/components/dex/types'
import { useRemote } from 'hooks'

const DEX_INTRO_VIEWED_KEY = 'dexIntroViewed'

export const useSceneResolver = (): [DexScenes, (scene: DexScenes) => void] => {
  const dispatch = useDispatch()

  const isOnboardingPassed = localStorage.getItem(DEX_INTRO_VIEWED_KEY)
  const [scene, setScene] = useState<DexScenes>(isOnboardingPassed ? 'SWAP' : 'ONBOARDING')

  const {
    data: isUserEligible,
    hasError: isUserEligibilityFailed,
    isLoading: isUserEligibilityLoading
  } = useRemote(selectors.components.dex.getIsUserEligible)

  useEffect(() => {
    dispatch(actions.components.dex.initiateDex())
  }, [])

  useEffect(() => {
    if (isUserEligible) {
      dispatch(actions.components.dex.fetchChains())
      dispatch(actions.core.data.coins.fetchCoinsRates())
    }
  }, [isUserEligible])

  useEffect(() => {
    if (isUserEligibilityLoading) setScene('LOADING')
    else if (isUserEligibilityFailed) setScene('ERROR')
    else if (!isUserEligible) setScene('NOT_ELIGIBLE')
    else if (!isOnboardingPassed) setScene('ONBOARDING')
    else setScene('SWAP')
  }, [isUserEligibilityLoading, isUserEligibilityFailed, isUserEligible, isOnboardingPassed])

  return [scene, setScene]
}
