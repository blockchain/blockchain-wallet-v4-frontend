import { lift, values } from 'ramda'

import { EarnEDDStatus, RemoteDataType } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { SuccessStateType } from './Earn.types'

const getData = (state: RootState): RemoteDataType<string, SuccessStateType> => {
  const userDataR = selectors.modules.profile.getUserData(state)
  const interestRatesR = selectors.components.interest.getInterestRates(state)
  const stakingRatesR = selectors.components.interest.getStakingRates(state)
  const earnEDDStatus = selectors.components.interest.getEarnEDDStatus(state).getOrElse({
    eddNeeded: false
  } as EarnEDDStatus)

  const transform = (interestRates, stakingRates, userData) => ({
    earnEDDStatus,
    interestRates,
    interestRatesArray: values(interestRates),
    stakingRates,
    userData
  })

  return lift(transform)(interestRatesR, stakingRatesR, userDataR)
}

export default getData
