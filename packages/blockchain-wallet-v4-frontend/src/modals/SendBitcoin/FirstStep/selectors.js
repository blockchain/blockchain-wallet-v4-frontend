import { selectors } from 'data'

export const getData = state => {
  const fee = selectors.core.data.bitcoin.getFee(state)
  return fee
}
