import BigNumber from 'bignumber.js'
import { add, lift, pathOr, reduce, toLower } from 'ramda'

import { Remote } from 'blockchain-wallet-v4/src'
import { INVALID_COIN_TYPE } from 'blockchain-wallet-v4/src/model'
import { CoinType, RemoteDataType } from 'blockchain-wallet-v4/src/types'
import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
import { selectors } from 'data'

// only hd accounts, no imported addresses
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

// only hd accounts, no imported addresses
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

    const balancesR: RemoteDataType<
      string,
      RemoteDataType<string, string>
    > = lift(contextToBalances)(Remote.of(context), addressesR)
    return balancesR.map(b => {
      return new BigNumber(b.getOrElse('0'))
    })
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

export const getErc20Balance = coin =>
  createDeepEqualSelector(
    [state => selectors.core.data.eth.getErc20Balance(state, coin)],
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
    case 'XLM':
      return getXlmBalance
    case 'AAVE':
    case 'PAX':
    case 'USDT':
    case 'WDGLD':
    case 'YFI':
      return getErc20Balance(toLower(coin))
    default:
      return Remote.Failure(INVALID_COIN_TYPE)
  }
}
