import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { actions } from 'data/remoteConfig'

export const useRemoteConfigPresenter = () => {
  const dispatch = useDispatch()

  const initialize = useCallback(() => {
    dispatch(actions.initialize())
  }, [dispatch])

  return {
    initialize
  }
}
