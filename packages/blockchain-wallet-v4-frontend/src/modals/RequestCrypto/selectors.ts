import { mapObjIndexed } from 'ramda'

import { DEFAULT_INVITATIONS } from 'blockchain-wallet-v4/src/model'
import {
  SupportedWalletCurrenciesType,
  WalletCurrencyType
} from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'

export const getData = state => {
  const invitations = selectors.core.settings
    .getInvitations(state)
    .getOrElse(DEFAULT_INVITATIONS)
  const supportedCoins = selectors.core.walletOptions
    .getSupportedCoins(state)
    .getOrElse({} as SupportedWalletCurrenciesType)

  // create a list of coins that user can request ensuring the following:
  // 1- user is invited to user coin
  // 2- coin is enabled for requests
  let requestableCoins = [] as Array<WalletCurrencyType>
  mapObjIndexed((coin, key) => {
    if (coin.availability.request && invitations[key])
      requestableCoins.push(key)
  }, supportedCoins)

  return requestableCoins
}
