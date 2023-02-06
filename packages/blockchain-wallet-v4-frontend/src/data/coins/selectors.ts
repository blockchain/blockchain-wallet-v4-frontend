import { any, isEmpty, isNil, map, values } from 'ramda'

import { Remote } from '@core'
import { CoinType, InvitationsType, RemoteDataType } from '@core/types'
import { selectors } from 'data'
import { CoinAccountSelectorType } from 'data/coins/types'
import { SwapAccountType } from 'data/components/swap/types'
import { RootState } from 'data/rootReducer'

import { CustodialAccountType } from './accountTypes/accountTypes.custodial'
import { DynamicSelfCustodyAccountType } from './accountTypes/accountTypes.dynamicSelfCustody'
import { ERC20AccountType } from './accountTypes/accountTypes.erc20'
import { NonCustodialAccountType } from './accountTypes/accountTypes.nonCustodial'

export const getKey = (coin: CoinType) => {
  if (selectors.core.data.coins.getErc20Coins().includes(coin)) {
    return 'ERC20'
  }
  if (selectors.core.data.coins.getDynamicSelfCustodyCoins().includes(coin)) {
    return 'DYNAMIC_SELF_CUSTODY'
  }
  return 'NON_CUSTODIAL'
}

// retrieves introduction text for coin on its transaction page
const getIntroductionText = (coin: string) => {
  return ''
}

const accountTypes = {
  CUSTODIAL: new CustodialAccountType({} as any, {} as any),
  DYNAMIC_SELF_CUSTODY: new DynamicSelfCustodyAccountType({} as any, {} as any),
  ERC20: new ERC20AccountType({} as any, {} as any),
  NON_CUSTODIAL: new NonCustodialAccountType({} as any, {} as any)
}

// generic selector that should be used by all features to request their desired
// account types for their coins
const getCoinAccounts = (state: RootState, ownProps: CoinAccountSelectorType) => {
  const getCoinAccountsR = (state: RootState) => {
    const coinList = ownProps?.coins

    // dynamically create account selectors via passed in coin list
    const accounts =
      isEmpty(coinList) || isNil(coinList)
        ? Remote.of({})
        : coinList.reduce((accounts, coin) => {
            const accountType = getKey(coin)
            accounts[coin] = accountTypes[accountType].getAccounts(state, { coin, ...ownProps })
            return accounts
          }, {})

    const isNotLoaded = (coinAccounts) => Remote.Loading.is(coinAccounts)
    if (any(isNotLoaded, values(accounts))) return Remote.Loading

    // @ts-ignore
    return Remote.of(
      map(
        (coinAccounts: RemoteDataType<string, typeof accounts>) =>
          (isEmpty(coinAccounts) && []) || (coinAccounts ? coinAccounts.getOrElse([]) : []),
        accounts
      ) as any
    )
  }

  const accountsR: RemoteDataType<string, { [key in CoinType]: Array<SwapAccountType> }> =
    getCoinAccountsR(state)

  return accountsR?.getOrElse({}) || {}
}

const getStxSelfCustodyAvailability = (state): boolean => {
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

export { getCoinAccounts, getIntroductionText, getStxSelfCustodyAvailability }
