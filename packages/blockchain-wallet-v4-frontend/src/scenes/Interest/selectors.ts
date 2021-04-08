import { lift, values } from 'ramda'

import { ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const userDataR = selectors.modules.profile.getUserData(state)
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)
  const interestRateR = selectors.components.interest.getInterestRate(state)
  const instrumentsR = selectors.components.interest.getInterestInstruments(
    state
  )

  const interestEDDStatusR = selectors.components.interest.getInterestEDDStatus(
    state
  )
  const transform = (
    instruments: ExtractSuccess<typeof instrumentsR>,
    interestRate,
    supportedCoins: ExtractSuccess<typeof supportedCoinsR>,
    userData: ExtractSuccess<typeof userDataR>,
    interestEDDStatus: ExtractSuccess<typeof interestEDDStatusR>
  ) => ({
    instruments,
    interestRate,
    interestRateArray: values(interestRate),
    supportedCoins,
    userData,
    interestEDDStatus
  })
  return lift(transform)(
    instrumentsR,
    interestRateR,
    supportedCoinsR,
    userDataR,
    interestEDDStatusR
  )
}
