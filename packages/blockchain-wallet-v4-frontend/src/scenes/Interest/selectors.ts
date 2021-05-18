import { lift, values } from 'ramda'

import { RemoteDataType } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { SuccessStateType } from '.'

const getData = (state: RootState): RemoteDataType<string, SuccessStateType> => {
  const userDataR = selectors.modules.profile.getUserData(state)
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)
  const interestRateR = selectors.components.interest.getInterestRate(state)
  const instrumentsR = selectors.components.interest.getInterestInstruments(state)
  const interestEDDStatusR = selectors.components.interest.getInterestEDDStatus(state)
  const transform = (instruments, interestRate, supportedCoins, userData, interestEDDStatus) => ({
    instruments,
    interestEDDStatus,
    interestRate,
    interestRateArray: values(interestRate),
    supportedCoins,
    userData,
  })
  return lift(transform)(
    instrumentsR,
    interestRateR,
    supportedCoinsR,
    userDataR,
    interestEDDStatusR
  )
}

export default getData
