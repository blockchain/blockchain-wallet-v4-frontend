import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { CoinType } from '@core/types'
import DataError from 'components/DataError'
import { actions } from 'data'
import { Analytics } from 'data/types'
import { useRemote } from 'hooks'

import Loading from '../Staking.template.loading'
import { getData } from './Warning.selectors'
import Warning from './Warning.template'

const WarningContainer = ({ coin, handleClose }: OwnProps) => {
  const { data, error, isLoading, isNotAsked } = useRemote(getData)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(actions.components.interest.fetchStakingLimits())
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

  if (error) return <DataError />
  if (!data || isLoading || isNotAsked) return <Loading />
  const { bondingDays } = data.stakingLimits[coin]

  return (
    <Warning
      bondingDays={bondingDays}
      coin={coin}
      handleClick={handleClick}
      handleClose={handleClose}
    />
  )
}

export type OwnProps = {
  coin: CoinType
  handleClose: () => void
}

export default WarningContainer
