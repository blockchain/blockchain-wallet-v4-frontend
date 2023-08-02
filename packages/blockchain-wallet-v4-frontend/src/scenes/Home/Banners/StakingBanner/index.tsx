import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { actions } from 'data'
import { useRemote } from 'hooks'

import ANNOUNCEMENTS from '../constants'
import { getData } from './StakingBanner.selectors'
import StakingBanner from './StakingBanner.template'

const StakingBannerContainer = () => {
  const dispatch = useDispatch()
  const { data, error, isLoading, isNotAsked } = useRemote(getData)

  useEffect(() => {
    dispatch(actions.components.interest.fetchStakingRates())
  }, [])

  if (!data || error || isLoading || isNotAsked) return null

  const onClickClose = () => {
    dispatch(actions.cache.announcementDismissed(ANNOUNCEMENTS.STAKING))
  }

  return <StakingBanner onClickClose={onClickClose} rate={data.rate} />
}

export default StakingBannerContainer
