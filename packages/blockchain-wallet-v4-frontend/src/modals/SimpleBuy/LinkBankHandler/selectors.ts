import { lift } from 'ramda'
import qs from 'qs'

import { Remote } from 'blockchain-wallet-v4/src'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'
import { WalletOptionsType } from 'core/types'

export const getData = (state: RootState) => {
  // TODO: YODLEE get partner data from selectors
  const providerDetailsR = Remote.Success({
    fastLinkUrl: 'https://en.wikipedia.org/wiki/Bitcoin',
    partner: 'YODLEE',
    token: 'abc'
  })
  const domains = selectors.core.walletOptions.getDomains(state).getOrElse({
    walletHelper: 'https://wallet-helper.blockchain.com'
  } as WalletOptionsType['domains'])

  const transform = providerDetails => {
    const partner = providerDetails.partner.toLowerCase()
    const queryString = qs.stringify(providerDetails)
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
