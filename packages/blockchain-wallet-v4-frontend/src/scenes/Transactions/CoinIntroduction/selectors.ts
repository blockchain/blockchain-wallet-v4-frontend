import { selectors } from 'data'

export const getTags = state => {
  // @ts-ignore
  return selectors.modules.profile
    .getTags(state)
    .getOrElse({ BLOCKSTACK: false })
}
export const getCurrentKYCState = state => {
  // @ts-ignore
  return selectors.modules.profile.getUserKYCState(state).getOrElse('NONE')
}
export const currentUserTier = state => {
  // @ts-ignore
  return selectors.modules.profile.getUserTiers(state).getOrElse({ current: 0 })
}
