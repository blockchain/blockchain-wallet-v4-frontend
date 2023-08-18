import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { actions } from 'data'
import { useRemote } from 'hooks'

import ANNOUNCEMENTS from '../constants'
import { getData } from './ActiveRewardsBanner.selectors'
import ActiveRewardsBanner from './ActiveRewardsBanner.template'

const ActiveRewardsBannerContainer = () => {
  const dispatch = useDispatch()
  const { data, error, isLoading, isNotAsked } = useRemote(getData)

  useEffect(() => {
    dispatch(actions.components.interest.fetchActiveRewardsRates())
  }, [])

  if (!data || error || isLoading || isNotAsked) return null

  const onClickClose = () => {
    dispatch(actions.cache.announcementDismissed(ANNOUNCEMENTS.ACTIVE_REWARDS))
  }

  return <ActiveRewardsBanner onClickClose={onClickClose} rate={data.rate} />
}

export default ActiveRewardsBannerContainer
