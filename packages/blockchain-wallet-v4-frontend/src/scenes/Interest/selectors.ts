import { lift, values } from 'ramda'

import { InterestEDDStatus, RemoteDataType } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { SuccessStateType } from '.'

const getData = (state: RootState): RemoteDataType<string, SuccessStateType> => {
  const userDataR = selectors.modules.profile.getUserData(state)
  const interestRatesR = selectors.components.interest.getInterestRates(state)
  const stakingRatesR = selectors.components.interest.getStakingRates(state)
  const interestEDDStatus = selectors.components.interest.getInterestEDDStatus(state).getOrElse({
    eddNeeded: false
  } as InterestEDDStatus)

  const sortedInstrumentsR = selectors.components.interest.getInstrumentsSortedByBalance(state)

  const transform = (interestRates, stakingRates, userData, sortedInstruments) => ({
    interestEDDStatus,
    interestRates,
    interestRatesArray: values(interestRates),
    sortedInstruments,
    stakingRates,
    userData
  })

  return lift(transform)(interestRatesR, stakingRatesR, userDataR, sortedInstrumentsR)
}

export default getData
