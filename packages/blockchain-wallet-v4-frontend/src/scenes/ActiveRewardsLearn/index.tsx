import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { SceneWrapper } from 'components/Layout'
import { actions } from 'data'
import { Analytics } from 'data/types'

import Cards from './Cards'
import Faq from './Faq'
import Header from './Header'
import HowItWorks from './HowItWorks'

const ActiveRewardsLearnContainer = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.WALLET_ACTIVE_REWARDS_LEARNING_PAGE_VIEWED,
        properties: {}
      })
    )
  }, [])

  return (
    <SceneWrapper>
      <Header />
      <Cards />
      <HowItWorks />
      <Faq />
    </SceneWrapper>
  )
}

export default ActiveRewardsLearnContainer
