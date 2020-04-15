import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

export const getData = (state: RootState) => {
  const shareStatusR = selectors.modules.profile.getShareWalletAddressesStatus(
    state
  )
  const walletAddressesR = selectors.modules.profile.getWalletAddresses(state)

  return lift((walletAddresses, shareStatus) => ({
    shareStatus,
    walletAddresses
  }))(walletAddressesR, shareStatusR)
}
