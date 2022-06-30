import BigNumber from 'bignumber.js'
import { add, lift, pathOr, reduce } from 'ramda'

import { Remote } from '@core'
import { CoinType, RemoteDataType } from '@core/types'
import { createDeepEqualSelector } from '@core/utils'
import { selectors } from 'data'

// only hd accounts, no imported addresses
const getBtcNonCustodialBalance = createDeepEqualSelector(
  [selectors.core.common.btc.getActiveHDAccounts],
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

// only hd accounts, no imported addresses
const getBchNonCustodialBalance = createDeepEqualSelector(
  [selectors.core.common.bch.getActiveHDAccounts],
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

const getEthNonCustodialBalance = createDeepEqualSelector(
  [selectors.core.kvStore.eth.getContext, selectors.core.data.eth.getAddresses],
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

const getXlmNonCustodialBalance = createDeepEqualSelector(
  [
    (state) =>
      selectors.core.kvStore.xlm
        .getDefaultAccountId(state)
        .map((accountId) => selectors.core.data.xlm.getBalance(state, accountId).getOrElse(0))
  ],
  (balanceR) => {
    return Remote.of(new BigNumber(balanceR.getOrElse(0)))
  }
)

const getErc20NonCustodialBalance = (coin) =>
  createDeepEqualSelector(
    [(state) => selectors.core.data.eth.getErc20Balance(state, coin)],
    (balanceR) => {
      return Remote.of(new BigNumber(balanceR.getOrElse(0)))
    }
  )

// TODO: add proper erc20 is default
// TODO: add DSC coins
// TODO: dont default to a coin
const getCoinNonCustodialBalance = (coin: CoinType) => {
  switch (coin) {
    case 'BTC':
      return getBtcNonCustodialBalance
    case 'BCH':
      return getBchNonCustodialBalance
    case 'ETH':
      return getEthNonCustodialBalance
    case 'XLM':
      return getXlmNonCustodialBalance
    default:
      return getErc20NonCustodialBalance(coin)
  }
}

export {
  getBchNonCustodialBalance,
  getBtcNonCustodialBalance,
  getCoinNonCustodialBalance,
  getErc20NonCustodialBalance,
  getEthNonCustodialBalance,
  getXlmNonCustodialBalance
}
