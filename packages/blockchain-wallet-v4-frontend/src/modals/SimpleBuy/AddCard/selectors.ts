import { lift } from 'ramda'
import { selectors } from 'data'

export const getData = state => {
  const cardR = selectors.components.simpleBuy.getSBCard(state)
  const fiatCurrency = selectors.components.simpleBuy.getFiatCurrency(state)

  const transform = card => ({
    card,
    fiatCurrency
  })

  return lift(transform)(cardR)
}
