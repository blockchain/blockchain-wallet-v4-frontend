import { selectors } from 'data'

export const getData = (state) => {
  const isSuperAppEnabled = selectors.core.walletOptions.getIsSuperAppEnabled(state)

  return { isSuperAppEnabled }
}
