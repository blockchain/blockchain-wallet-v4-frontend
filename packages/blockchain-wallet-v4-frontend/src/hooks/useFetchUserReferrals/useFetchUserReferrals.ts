import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { actions } from 'data'

import { FetchUserReferralsCallback, FetchUserReferralsHook } from './useFetchUserReferrals.types'

export const useFetchUserReferrals: FetchUserReferralsHook = () => {
  const dispatch = useDispatch()

  const fetchUserReferrals: FetchUserReferralsCallback = useCallback(() => {
    dispatch(actions.modules.profile.fetchUserReferral())
  }, [dispatch])

  return fetchUserReferrals
}
