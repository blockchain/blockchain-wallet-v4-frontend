import { lift } from 'ramda'

import { ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const documentLimitsR =
    selectors.components.interestUploadDocument.getInterestEDDDocumentLimits(state)
  const countryCode = selectors.core.settings.getCountryCode(state).getOrElse(null)
  const userDataR = selectors.modules.profile.getUserData(state)
  const step = selectors.components.interestUploadDocument.getStep(state)

  return lift(
    (
      documentLimits: ExtractSuccess<typeof documentLimitsR>,
      userData: ExtractSuccess<typeof userDataR>
    ) => ({
      countryCode,
      documentLimits,
      step,
      userData
    })
  )(documentLimitsR, userDataR)
}
