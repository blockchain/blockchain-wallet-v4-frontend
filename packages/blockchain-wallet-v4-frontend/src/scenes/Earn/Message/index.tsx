import React from 'react'
import { useDispatch } from 'react-redux'

import { EarnEDDStatus, RewardsRatesType, StakingRatesType } from '@core/types'
import { Text } from 'blockchain-info-components'
import { actions } from 'data'
import { ModalName } from 'data/types'
import { useRemote } from 'hooks'

import Loading from '../Earn.MessageLoading.template'
import getData from './Message.selectors'
import NotGoldTierMessage from './NotGoldTierMessage.template'

const MessageContainer = ({ isGoldTier }: PropTypes) => {
  const { data, error, isLoading, isNotAsked } = useRemote(getData)
  const dispatch = useDispatch()

  if (error)
    return (
      <Text size='16px' weight={500}>
        Oops. Something went wrong. Please refresh and try again.
      </Text>
    )

  if (!data || isLoading || isNotAsked) return <Loading />
  const { earnEDDStatus, rewardsRates, stakingRates }: DataType = data
  const rates: Array<number> = Object.values(rewardsRates)
  Object.values(stakingRates).forEach(({ rate }) => rates.push(rate))

  const handleClick = () => {
    dispatch(actions.modals.showModal(ModalName.COMPLETE_USER_PROFILE, { origin: 'EarnPage' }))
  }

  if (!isGoldTier) {
    return <NotGoldTierMessage handleClick={handleClick} maxRate={Math.max(...rates)} />
  }

  if (earnEDDStatus.eddNeeded) {
    return <div>hi</div>
  }

  return null
}

type DataType = {
  earnEDDStatus: EarnEDDStatus
  rewardsRates: RewardsRatesType['rates']
  stakingRates: StakingRatesType['rates']
}

type PropTypes = {
  isGoldTier: boolean
}

export default MessageContainer
