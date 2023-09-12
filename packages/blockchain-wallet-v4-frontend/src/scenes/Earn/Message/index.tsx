import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'

import { EarnEDDStatus, EarnRatesType, RewardsRatesType } from '@core/types'
import { Text } from 'blockchain-info-components'
import { actions } from 'data'
import { useRemote } from 'hooks'

import Loading from '../Earn.MessageLoading.template'
import EDDAdditionalInfoMessage from './EDDAdditionalInfoMessage.template'
import EDDInformationSubmitted from './EDDInformationSubmitted.template'
import getData from './Message.selectors'

const MessageContainer = () => {
  const { data, error, isLoading, isNotAsked } = useRemote(getData)
  const dispatch = useDispatch()

  if (error)
    return (
      <Text size='16px' weight={500}>
        <FormattedMessage
          id='copy.oops.message'
          defaultMessage='Oops. Something went wrong. Please refresh and try again.'
        />
      </Text>
    )

  if (!data || isLoading || isNotAsked) return <Loading />
  const {
    earnEDDStatus: { eddNeeded, eddPassed, eddSubmitted },
    rewardsRates,
    stakingRates
  }: DataType = data
  const rates: Array<number> = Object.values(rewardsRates)
  const isEDDRequired: boolean = eddNeeded && !eddPassed && !eddSubmitted
  const isEDDSubmitted: boolean = eddNeeded && eddSubmitted && !eddPassed
  Object.values(stakingRates).forEach(({ rate }) => rates.push(rate))

  const handleEDDSubmitInfo = () => {
    dispatch(actions.components.interestUploadDocument.showModal({ origin: 'EarnPage' }))
  }

  if (isEDDRequired) {
    return <EDDAdditionalInfoMessage handleClick={handleEDDSubmitInfo} />
  }

  if (isEDDSubmitted) {
    return <EDDInformationSubmitted handleClick={handleEDDSubmitInfo} />
  }

  return null
}

type DataType = {
  earnEDDStatus: EarnEDDStatus
  rewardsRates: RewardsRatesType['rates']
  stakingRates: EarnRatesType['rates']
}

export default MessageContainer
