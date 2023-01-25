import { useSelector } from 'react-redux'

import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const useSardineContext = (flowName: string) => {
  const isFlowInRiskSettings = useSelector((state: RootState) =>
    selectors.modules.profile.isFlowInRiskSettings(state, flowName)
  )

  const sardineContext = window?._SardineContext || {}
  const sardineContextIsReady = !!window?._SardineContext && isFlowInRiskSettings

  return [sardineContextIsReady, sardineContext]
}

export default useSardineContext
