import qs from 'qs'
import { lift } from 'ramda'

import { Remote } from '@core'
import { ExtractSuccess, WalletOptionsType } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const bankCredentialsR = selectors.components.brokerage.getBankCredentials(state)
  const providerDetailsR = Remote.Success(bankCredentialsR)
  const domains = selectors.core.walletOptions.getDomains(state).getOrElse({
    walletHelper: 'https://wallet-helper.blockchain.com'
  } as WalletOptionsType['domains'])

  const transform = (providerDetails, bankCredentials: ExtractSuccess<typeof bankCredentialsR>) => {
    const partner = providerDetails.data.partner.toLowerCase()
    const queryString = qs.stringify({
      ...providerDetails.data.attributes,
      ...providerDetails.data.attributes.fastlinkParams
    })
    const iFrameUrl = `${domains.walletHelper}/wallet-helper/${partner}#/linkBank?${queryString}`
    return { bankCredentials, iFrameUrl }
  }

  return lift(transform)(providerDetailsR, bankCredentialsR)
}
