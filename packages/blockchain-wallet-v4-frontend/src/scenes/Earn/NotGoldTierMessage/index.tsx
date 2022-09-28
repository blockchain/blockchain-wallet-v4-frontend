import React from 'react'
import { useDispatch } from 'react-redux'

import { RewardsRatesType, StakingRatesType } from '@core/types'
import { Text } from 'blockchain-info-components'
import { actions } from 'data'
import { ModalName } from 'data/types'
import { useRemote } from 'hooks'

import Loading from '../Earn.MessageLoading.template'
import getData from './NotGoldTierMessage.selectors'
import NotGoldTierMessage from './NotGoldTierMessage.template'

const NotGoldTierMessageContainer = () => {
  const { data, error, isLoading, isNotAsked } = useRemote(getData)
  const dispatch = useDispatch()

  if (error)
    return (
      <Text size='16px' weight={500}>
        Oops. Something went wrong. Please refresh and try again.
      </Text>
    )

  if (!data || isLoading || isNotAsked) return <Loading />
  const { rewardsRates, stakingRates }: DataType = data
  const rates: Array<number> = Object.values(rewardsRates)
  Object.values(stakingRates).forEach(({ rate }) => rates.push(rate))

  const handleClick = () => {
    dispatch(actions.modals.showModal(ModalName.COMPLETE_USER_PROFILE, { origin: 'EarnPage' }))
  }

  return <NotGoldTierMessage handleClick={handleClick} maxRate={Math.max(...rates)} />
}

type DataType = {
  rewardsRates: RewardsRatesType['rates']
  stakingRates: StakingRatesType['rates']
}

export default NotGoldTierMessageContainer
