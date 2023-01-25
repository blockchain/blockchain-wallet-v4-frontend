import { createSelector } from '@reduxjs/toolkit'

import { getDomains } from '@core/redux/walletOptions/selectors'
import { WalletOptionsType } from '@core/types'
import { RootState } from 'data/rootReducer'

export const getBankCredentials = (state: RootState) => state.components.brokerage.bankCredentials

export const getBankTransferAccounts = (state: RootState) =>
  state.components.brokerage.bankTransferAccounts

export const getAddBankStep = (state: RootState) => state.components.brokerage.addBankStep

export const getDWStep = (state: RootState) => state.components.brokerage.dwStep
export const getDepositTerms = (state: RootState) => state.components.brokerage.depositTerms

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
  (state: RootState) => getDomains(state),
  (domainsR) => {
    const { walletHelper } = domainsR.getOrElse({
      walletHelper: 'https://wallet-helper.blockchain.com'
    } as WalletOptionsType['domains'])

    return `${walletHelper}/wallet-helper/plaid`
  }
)

export const getCrossBorderLimits = (state: RootState) =>
  state.components.brokerage.crossBorderLimits
