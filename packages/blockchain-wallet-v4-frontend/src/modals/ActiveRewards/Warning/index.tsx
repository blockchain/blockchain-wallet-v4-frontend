import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { CoinType } from '@core/types'
import { actions } from 'data'
import { Analytics } from 'data/types'

import Warning from './Warning.template'

const WarningContainer = ({ coin, handleClose }: OwnProps) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(actions.components.interest.fetchActiveRewardsLimits())
  }, [])

  const handleClick = () => {
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.WALLET_REWARDS_DETAIL_DEPOSIT_CLICKED,
        properties: {
          currency: coin
        }
      })
    )
    dispatch(actions.components.interest.showStakingModal({ coin, step: 'DEPOSIT' }))
  }

  return <Warning coin={coin} handleClick={handleClick} handleClose={handleClose} />
}

export type OwnProps = {
  coin: CoinType
  handleClose: () => void
}

export default WarningContainer
