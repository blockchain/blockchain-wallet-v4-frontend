import { path } from 'ramda'
import { selectors } from 'data'

export const getData = state => {
  const quotation = selectors.core.data.shapeShift.getShapeshiftQuotation(state)

  return quotation.map(x => ({
    source: path(['depositAmount'], x),
    target: path(['withdrawalAmount'], x)
  }))
}
