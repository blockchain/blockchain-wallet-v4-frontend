import BigNumber from 'bignumber.js'
import { add, lift, pathOr, reduce } from 'ramda'

import { coreSelectors, Remote } from '@core'
import { RemoteDataType } from '@core/remote/types'
import { createDeepEqualSelector } from '@core/utils'

// gets BTC non-custodial balance which includes hd accounts excluding imported addresses
export const __getBtcNonCustodialBalance = createDeepEqualSelector(
  [coreSelectors.common.btc.getActiveHDAccounts],
  (accountsR) => {
    const getBalances = (balances) => {
      const walletBalances: Array<number> = balances.map((account) =>
        pathOr(0, ['info', 'final_balance'], account)
      )
      return walletBalances
    }
    const balancesR = lift(getBalances)(accountsR)

    return balancesR.map(reduce<number, number>(add, 0))
  }
)

// gets BCH non-custodial balance which includes hd accounts excluding imported addresses
export const __getBchNonCustodialBalance = createDeepEqualSelector(
  [coreSelectors.common.bch.getActiveHDAccounts],
  (accountsR) => {
    const getBalances = (balances) => {
      const walletBalances: Array<number> = balances.map((account) =>
        pathOr(0, ['info', 'final_balance'], account)
      )
      return walletBalances
    }
    const balancesR = lift(getBalances)(accountsR)

    return balancesR.map(reduce<number, number>(add, 0))
  }
)

// gets ETH non-custodial balance
export const __getEthNonCustodialBalance = createDeepEqualSelector(
  [coreSelectors.kvStore.eth.getContext, coreSelectors.data.eth.getAddresses],
  (context, addressesR) => {
    const contextToBalances = (context, balances) =>
      context.map((a) => pathOr(0, [a, 'balance'], balances))

    const balancesR: RemoteDataType<string, RemoteDataType<string, string>> = lift(
      contextToBalances
    )(Remote.of(context), addressesR)
    return balancesR.map((b) => {
      return new BigNumber(b.getOrElse('0'))
    })
  }
)

// gets XLM non-custodial balance
export const __getXlmNonCustodialBalance = createDeepEqualSelector(
  [
    (state) =>
      coreSelectors.kvStore.xlm
        .getDefaultAccountId(state)
        .map((accountId) => coreSelectors.data.xlm.getBalance(state, accountId).getOrElse(0))
  ],
  (balanceR) => {
    return Remote.of(new BigNumber(balanceR.getOrElse(0)))
  }
)

// given an ERC20 coin, returns its non-custodial balance
export const __getErc20NonCustodialBalance = (coin) =>
  createDeepEqualSelector(
    [(state) => coreSelectors.data.eth.getErc20Balance(state, coin)],
    (balanceR) => {
      return Remote.of(new BigNumber(balanceR.getOrElse(0)))
    }
  )
