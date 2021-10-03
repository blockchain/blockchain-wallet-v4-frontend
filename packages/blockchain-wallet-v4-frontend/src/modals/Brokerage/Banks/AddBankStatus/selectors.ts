import { lift } from 'ramda'

import { ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { OBType } from 'data/types'

export const getData = (state: RootState) => {
  const bankStatusR = selectors.components.brokerage.getAddBankStatus(state)
  const bankCredentialsR = selectors.components.brokerage
    .getBankCredentials(state)
    .getOrElse({} as OBType)
  return lift((bankStatus: ExtractSuccess<typeof bankStatusR>) => ({
    bankCredentials: bankCredentialsR,
    bankStatus
  }))(bankStatusR)
}

export default getData
