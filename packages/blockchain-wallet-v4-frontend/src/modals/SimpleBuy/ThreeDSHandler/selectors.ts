import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

export const getData = (state: RootState) => {
  const providerDetailsR = selectors.components.simpleBuy.getSBProviderDetails(
    state
  )
  const threeDSDetailsR = selectors.components.simpleBuy.getEverypay3DSDetails(
    state
  )

  const transform = (providerDetails, threeDSDetails) => ({
    providerDetails,
    threeDSDetails
  })

  return lift(transform)(providerDetailsR, threeDSDetailsR)
}
