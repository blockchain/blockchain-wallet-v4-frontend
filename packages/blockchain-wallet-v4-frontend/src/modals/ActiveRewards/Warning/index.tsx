import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { CoinType } from '@core/types'
import { Analytics } from 'data/types'

import { getActions } from './Warning.selectors'
import Warning from './Warning.template'

const WarningContainer = ({ coin, handleClose }: OwnProps) => {
  const dispatch = useDispatch()
  const { analyticsActions, earnActions } = getActions(dispatch)

  useEffect(() => {
    earnActions.fetchActiveRewardsLimits()
  }, [])

  const handleClick = () => {
    analyticsActions.trackEvent({
      key: Analytics.WALLET_REWARDS_DETAIL_DEPOSIT_CLICKED,
      properties: {
        currency: coin
      }
    })

    earnActions.showActiveRewardsModal({ coin, step: 'DEPOSIT' })
  }

  return <Warning coin={coin} handleClick={handleClick} handleClose={handleClose} />
}

export type OwnProps = {
  coin: CoinType
  handleClose: () => void
}

export default WarningContainer
