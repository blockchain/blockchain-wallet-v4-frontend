import { path, propOr } from 'ramda'

import { fiatToString } from 'blockchain-wallet-v4/src/exchange/utils'
import { selectors } from 'data'

export const getData = (state, { currentTier, nextTier }) => {
  // @ts-ignore
  const nextTierLimits = selectors.modules.profile
    .getTiers(state)
    .map(path([nextTier - 1, 'limits']))
  const currency = nextTierLimits.map(propOr('USD', 'currency')).getOrElse('USD')
  const amountLeft = selectors.modules.profile
    .getUserData(state)
    .map((x) => x.limits[currentTier - 1].annual)
    .getOrElse('0')
  const nextTierAmount = nextTierLimits.map(propOr(0, 'daily')).getOrElse(0)
  return {
    amountLeft: fiatToString({ unit: currency, value: amountLeft }),
    nextTierAmount: fiatToString({ unit: currency, value: nextTierAmount }),
  }
}
