import { selectors } from 'data'

export const getData = state => ({
  step: selectors.components.exchange.getStep(state)
})
