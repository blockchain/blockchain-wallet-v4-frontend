import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { CoinType } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { Analytics } from 'data/types'

import { getActions } from './Warning.selectors'
import Warning from './Warning.template'

const WarningContainer = ({ coin, handleClose }: OwnProps) => {
  const dispatch = useDispatch()
  const isActiveRewardsWithdrawalEnabled = useSelector(
    (state: RootState) =>
      selectors.core.walletOptions
        .getActiveRewardsWithdrawalEnabled(state)
        .getOrElse(false) as boolean
  )
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

  return (
    <Warning
      coin={coin}
      handleClick={handleClick}
      handleClose={handleClose}
      isActiveRewardsWithdrawalEnabled={isActiveRewardsWithdrawalEnabled}
    />
  )
}

export type OwnProps = {
  coin: CoinType
  handleClose: () => void
}

export default WarningContainer
