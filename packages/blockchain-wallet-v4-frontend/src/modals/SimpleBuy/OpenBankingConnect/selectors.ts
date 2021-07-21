import { lift } from 'ramda'

import { ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

const getData = (state: RootState) => {
  const bankCredentialsR = selectors.components.brokerage.getBankCredentials(state)

  return lift((bankCredentials: ExtractSuccess<typeof bankCredentialsR>) => ({
    bankCredentials
  }))(bankCredentialsR)
}

export default getData
