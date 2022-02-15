import { lift, values } from 'ramda'

import { InterestEDDStatus, RemoteDataType } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { SuccessStateType } from '.'

const getData = (state: RootState): RemoteDataType<string, SuccessStateType> => {
  const userDataR = selectors.modules.profile.getUserData(state)
  const interestRateR = selectors.components.interest.getInterestRate(state)
  const interestEDDStatus = selectors.components.interest.getInterestEDDStatus(state).getOrElse({
    eddNeeded: false
  } as InterestEDDStatus)

  const transform = (interestRate, userData) => ({
    interestEDDStatus,
    interestRate,
    interestRateArray: values(interestRate),
    userData
  })

  return lift(transform)(interestRateR, userDataR)
}

export default getData
