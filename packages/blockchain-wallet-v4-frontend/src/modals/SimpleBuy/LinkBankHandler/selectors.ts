import { lift } from 'ramda'
import qs from 'qs'

import { Remote } from 'blockchain-wallet-v4/src'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'
import { WalletOptionsType } from 'core/types'

export const getData = (state: RootState) => {
  // TODO: YODLEE get partner data from selectors
  const fastLink = selectors.components.simpleBuy.getFastLink(state)
  const providerDetailsR = Remote.Success(fastLink)
  const domains = selectors.core.walletOptions.getDomains(state).getOrElse({
    walletHelper: 'https://wallet-helper.blockchain.com'
  } as WalletOptionsType['domains'])

  const transform = providerDetails => {
    const partner = providerDetails.data.partner.toLowerCase()
    const queryString = qs.stringify({
      ...providerDetails.data.attributes,
      ...providerDetails.data.attributes.fastlinkParams
    })
    const iFrameUrl =
      domains.walletHelper +
      '/wallet-helper/' +
      partner +
      '#/linkBank?' +
      queryString
    return { iFrameUrl }
  }

  return lift(transform)(providerDetailsR)
}
