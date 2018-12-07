import { prop } from 'ramda'

import { selectors } from 'data'

/**
 * @param {*} state
 * @param {{ type: 'send' | 'request' }} param1
 */
export const getCoins = (state, { type }) =>
  [
    { text: 'Bitcoin', value: 'BTC' },
    { text: 'Ether', value: 'ETH' },
    { text: 'Bitcoin Cash', value: 'BCH' },
    { text: 'Stellar', value: 'XLM' }
  ].filter(({ value }) =>
    selectors.core.walletOptions
      .getCoinAvailability(state, value)
      .map(prop(type))
      .getOrElse(false)
  )
