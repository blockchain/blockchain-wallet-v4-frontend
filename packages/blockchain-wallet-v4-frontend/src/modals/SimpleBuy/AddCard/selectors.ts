import { lift } from 'ramda'
import { selectors } from 'data'

export const getData = state => {
  const cardR = selectors.components.simpleBuy.getSBCard(state)
  const fiatCurrency = selectors.components.simpleBuy.getFiatCurrency(state)
  const providerDetailsR = selectors.components.simpleBuy.getSBProviderDetails(
    state
  )

  const transform = (card, providerDetails) => ({
    card,
    fiatCurrency,
    providerDetails
  })

  return lift(transform)(cardR, providerDetailsR)
}
