import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { CoinType } from '@core/types'
import { Analytics } from 'data/types'
import { useRemote } from 'hooks'

import Loading from '../ActiveRewards.template.loading'
import { getActions, getRemote } from './Warning.selectors'
import Warning from './Warning.template'

const WarningContainer = ({ coin, handleClose }: OwnProps) => {
  const dispatch = useDispatch()
  const { data, isLoading, isNotAsked } = useRemote(getRemote)
  const { analyticsActions, earnActions } = getActions(dispatch)

  useEffect(() => {
    earnActions.fetchActiveRewardsLimits()
  }, [])

  if (!data || isLoading || isNotAsked) return <Loading />
  const { hasBalance, isActiveRewardsWithdrawalEnabled } = data || {}

  const handleClick = () => {
    analyticsActions.trackEvent({
      key: Analytics.WALLET_REWARDS_DETAIL_DEPOSIT_CLICKED,
      properties: {
        currency: coin
      }
    })

    earnActions.showActiveRewardsModal({ coin, step: hasBalance ? 'DEPOSIT' : 'NO_BALANCE' })
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
