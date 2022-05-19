import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

const getData = (state: RootState) => {
  const bankCredentialsR = selectors.components.brokerage.getBankCredentials(state)
  const orderR = selectors.components.buySell.getBSOrder(state)

  return lift(
    (
      order: ExtractSuccess<typeof orderR>,
      bankCredentials: ExtractSuccess<typeof bankCredentialsR>
    ) => ({
      bankCredentials,
      order
    })
  )(orderR, bankCredentialsR)
}

export default getData
