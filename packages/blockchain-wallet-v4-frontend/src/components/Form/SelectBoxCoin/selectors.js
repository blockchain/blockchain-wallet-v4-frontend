import { map, prop, reject, values } from 'ramda'

import { model, selectors } from 'data'

const { COIN_MODELS } = model.coins
// TODO: better way to exclude BSV via model
export const getCoins = (state, { type }) =>
  values(
    map(
      x => ({ text: x.displayName, value: x.coinCode }),
      reject(c => c.coinCode === 'BSV', COIN_MODELS)
    )
  ).filter(({ value }) =>
    selectors.core.walletOptions
      .getCoinAvailability(state, value)
      .map(prop(type))
      .getOrElse(false)
  )
