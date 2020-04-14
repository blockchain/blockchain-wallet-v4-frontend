import { lift } from 'ramda'
import { selectors } from 'data'

export const getData = state => {
  const cardR = selectors.components.simpleBuy.getSBCard(state)

  const transform = card => ({
    card
  })

  return lift(transform)(cardR)
}
