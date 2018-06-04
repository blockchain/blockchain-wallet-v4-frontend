import { selectors } from 'data'

export const getData = (state) => selectors.core.data.coinify.getQuote(state)
