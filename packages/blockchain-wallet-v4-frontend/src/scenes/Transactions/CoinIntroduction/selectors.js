import { propOr, toUpper } from 'ramda'

import { selectors } from 'data'

export const getAvailability = (state, ownProps) => {
  const availability = selectors.core.walletOptions.getCoinAvailability(
    state,
    toUpper(ownProps.coin)
  )
  return {
    exchange: availability.map(propOr(true, 'exchange')).getOrElse(false),
    request: availability.map(propOr(true, 'request')).getOrElse(false)
  }
}
export const getTags = state => {
  return selectors.modules.profile
    .getTags(state)
    .getOrElse({ BLOCKSTACK: false })
}
export const getCurrentKYCState = state => {
  return selectors.modules.profile.getUserKYCState(state).getOrElse('NONE')
}
export const currentUserTier = state => {
  return selectors.modules.profile.getUserTiers(state).getOrElse({ current: 0 })
}
