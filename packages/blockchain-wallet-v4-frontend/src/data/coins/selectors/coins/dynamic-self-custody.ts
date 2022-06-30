import { lift } from 'ramda'

import { getBalance } from '@core/redux/data/coins/selectors'
import { BSBalanceType, InvitationsType } from '@core/types'
import { createDeepEqualSelector } from '@core/utils'
import { selectors } from 'data'
import { getCoinTradingBalance } from 'data/coins/selectors'
import { generateSelfCustodyAccount, generateTradingAccount } from 'data/coins/utils'
import { SwapAccountType } from 'data/types'

export const getTransactionPageHeaderText = () => null

// main selector for all SELF-CUSTODY account types
// accepts a coin string
export const getAccounts = createDeepEqualSelector(
  [
    (state, ownProps) => getBalance(ownProps.coin, state),
    (state, { coin }) => getCoinTradingBalance(coin, state), // custodial accounts
    (state, ownProps) => ownProps // selector config
  ],
  (balanceR, sbBalanceR, ownProps) => {
    const { coin } = ownProps
    const { coinfig } = window.coins[coin]
    let accounts: SwapAccountType[] = []

    const transform = (balance, sbBalance) => {
      accounts = accounts.concat(generateSelfCustodyAccount(coin, balance))

      // add trading accounts if requested
      if (ownProps?.tradingAccounts && coinfig.products.includes('CustodialWalletBalance')) {
        accounts = accounts.concat(generateTradingAccount(coin, sbBalance as BSBalanceType))
      }
      return accounts
    }

    return lift(transform)(balanceR, sbBalanceR)
  }
)

export const getStxSelfCustodyAvailability = (state): boolean => {
  const isDoubleEncrypted = selectors.core.wallet.isSecondPasswordOn(state) as boolean
  if (isDoubleEncrypted) return false

  const featureFlagsR = selectors.core.walletOptions.getFeatureFlags(state)
  const tagsR = selectors.modules.profile.getBlockstackTag(state)
  const invitationsR = selectors.core.settings.getInvitations(state)

  const featureFlags = featureFlagsR.getOrElse({
    stxSelfCustodyEnableAirdrop: false,
    stxSelfCustodyEnableAll: false
  })
  const tag = tagsR.getOrElse(false)
  const invitations = invitationsR.getOrElse({ stxSelfCustody: true } as InvitationsType)

  if (invitations.stxSelfCustody) {
    if (tag && featureFlags.stxSelfCustodyEnableAirdrop) {
      return true
    }
    return featureFlags.stxSelfCustodyEnableAll
  }

  return false
}
