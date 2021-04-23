import { lift } from 'ramda'

import { ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const bankStatusR = selectors.components.brokerage.getAddBankStatus(state)
  const bankCredentialsR = selectors.components.brokerage.getBankCredentials(
    state
  )

  return lift(
    (
      bankStatus: ExtractSuccess<typeof bankStatusR>,
      bankCredentials: ExtractSuccess<typeof bankCredentialsR>
    ) => ({
      bankStatus,
      bankCredentials
    })
  )(bankStatusR, bankCredentialsR)
}
