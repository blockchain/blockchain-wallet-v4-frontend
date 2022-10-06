import { createSelector } from '@reduxjs/toolkit'

import { Remote } from '@core'
import { WalletOptionsType } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { DEFAULT_BS_BALANCE } from '../buySell/model'

export const getBankCredentials = (state: RootState) => state.components.brokerage.bankCredentials

export const getBankTransferAccounts = (state: RootState) =>
  state.components.brokerage.bankTransferAccounts

export const getAddBankStep = (state: RootState) => state.components.brokerage.addBankStep

export const getDWStep = (state: RootState) => state.components.brokerage.dwStep

export const getAccount = (state: RootState) => state.components.brokerage.account
export const getActiveAccount = createSelector(getAccount, (account) => {
  if (!account || account.state !== 'ACTIVE') return undefined
  return account
})

export const getRedirectBackToStep = (state: RootState) =>
  state.components.brokerage.redirectBackToStep

export const getAddBankStatus = (state: RootState) => state.components.brokerage.bankStatus

export const getFiatCurrency = (state: RootState) => state.components.brokerage.fiatCurrency

export const getIsFlow = (state: RootState) => state.components.brokerage.isFlow

export const getReason = (state: RootState) => state.components.brokerage.reason

export const getPlaidWalletHelperLink = createSelector(
  (state: RootState) => selectors.core.walletOptions.getDomains(state),
  (domainsR) => {
    const { walletHelper } = domainsR.getOrElse({
      walletHelper: 'https://wallet-helper.blockchain.com'
    } as WalletOptionsType['domains'])

    return `${walletHelper}/wallet-helper/plaid`
  }
)

export const getCrossBorderLimits = (state: RootState) =>
  state.components.brokerage.crossBorderLimits

export const getWithdrawableBalance = createSelector(
  (state: RootState) => selectors.components.buySell.getBSBalances(state),
  (state: RootState) => selectors.modules.profile.getUserCurrencies(state),
  (sbBalancesR, userCurrenciesR) => {
    const { defaultWalletCurrency } = userCurrenciesR.getOrFail('could not get user currencies')

    return Remote.of(
      sbBalancesR.getOrElse({
        [defaultWalletCurrency]: DEFAULT_BS_BALANCE
      })[defaultWalletCurrency]?.withdrawable || '0'
    )
  }
)
