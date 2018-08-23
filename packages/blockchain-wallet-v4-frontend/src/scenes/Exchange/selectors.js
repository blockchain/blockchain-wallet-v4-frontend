import { selectors } from 'data'

export const getData = state => ({
  useShapeShift: selectors.components.exchange.useShapeShift(state)
})
