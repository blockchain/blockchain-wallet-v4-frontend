import qs from 'qs'
import { lift } from 'ramda'

import { Remote } from 'blockchain-wallet-v4/src'
import {
  ExtractSuccess,
  WalletOptionsType
} from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  // TODO: YODLEE get partner data from selectors
  const fastLinkR = selectors.components.brokerage.getFastLink(state)
  const providerDetailsR = Remote.Success(fastLinkR)
  const domains = selectors.core.walletOptions.getDomains(state).getOrElse({
    walletHelper: 'https://wallet-helper.blockchain.com'
  } as WalletOptionsType['domains'])

  const transform = (
    providerDetails,
    fastLink: ExtractSuccess<typeof fastLinkR>
  ) => {
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
    return { iFrameUrl, fastLink }
  }

  return lift(transform)(providerDetailsR, fastLinkR)
}
