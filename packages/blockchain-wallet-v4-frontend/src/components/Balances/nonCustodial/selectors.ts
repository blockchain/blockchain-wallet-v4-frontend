import { add, lift, pathOr, reduce } from 'ramda'

import { CoinType, RemoteDataType } from 'core/types'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import { Remote } from 'blockchain-wallet-v4/src'

import { INVALID_COIN_TYPE } from 'blockchain-wallet-v4/src/model'
import { selectors } from 'data'
import BigNumber from 'bignumber.js'

export const getBtcBalance = createDeepEqualSelector(
  [selectors.core.common.btc.getActiveHDAccounts],
  accountsR => {
    const getBalances = balances => {
      const walletBalances: Array<number> = balances.map(account =>
        pathOr(0, ['info', 'final_balance'], account)
      )
      return walletBalances
    }
    const balancesR = lift(getBalances)(accountsR)

    return balancesR.map(reduce<number, number>(add, 0))
  }
)

export const getBchBalance = createDeepEqualSelector(
  [selectors.core.common.bch.getActiveHDAccounts],
  accountsR => {
    const getBalances = balances => {
      const walletBalances: Array<number> = balances.map(account =>
        pathOr(0, ['info', 'final_balance'], account)
      )
      return walletBalances
    }
    const balancesR = lift(getBalances)(accountsR)

    return balancesR.map(reduce<number, number>(add, 0))
  }
)

export const getEthBalance = createDeepEqualSelector(
  [selectors.core.kvStore.eth.getContext, selectors.core.data.eth.getAddresses],
  (context, addressesR) => {
    const contextToBalances = (context, balances) =>
      context.map(a => pathOr(0, [a, 'balance'], balances))

    const balancesR: RemoteDataType<string, string> = lift(contextToBalances)(
      Remote.of(context),
      addressesR
    )
    return balancesR.map(b => {
      return new BigNumber(b.getOrElse(0))
    })
  }
)

export const getPaxBalance = createDeepEqualSelector(
  [state => selectors.core.data.eth.getErc20Balance(state, 'pax')],
  balanceR => {
    return Remote.of(new BigNumber(balanceR.getOrElse(0)))
  }
)

export const getXlmBalance = createDeepEqualSelector(
  [
    state =>
      selectors.core.kvStore.xlm
        .getDefaultAccountId(state)
        .map(accountId =>
          selectors.core.data.xlm.getBalance(state, accountId).getOrElse(0)
        )
  ],
  balanceR => {
    return Remote.of(new BigNumber(balanceR.getOrElse(0)))
  }
)

export const getUsdtBalance = createDeepEqualSelector(
  [state => selectors.core.data.eth.getErc20Balance(state, 'usdt')],
  balanceR => {
    return Remote.of(new BigNumber(balanceR.getOrElse(0)))
  }
)

export const getBalanceSelector = (coin: CoinType) => {
  switch (coin) {
    case 'BTC':
      return getBtcBalance
    case 'BCH':
      return getBchBalance
    case 'ETH':
      return getEthBalance
    case 'PAX':
      return getPaxBalance
    case 'XLM':
      return getXlmBalance
    case 'USDT':
      return getUsdtBalance
    default:
      return Remote.Failure(INVALID_COIN_TYPE)
  }
}
