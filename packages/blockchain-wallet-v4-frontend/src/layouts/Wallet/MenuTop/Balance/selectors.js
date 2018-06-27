import { add, lift, pathOr, reduce } from 'ramda'
import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import { Remote } from 'blockchain-wallet-v4/src'

export const getBtcBalance = createDeepEqualSelector(
  [
    selectors.core.wallet.getSpendableContext,
    selectors.core.data.bitcoin.getAddresses
  ],
  (context, addressesR) => {
    const contextToBalances = (context, balances) => context.map(a => pathOr(0, [a, 'final_balance'], balances))
    const balancesR = lift(contextToBalances)(Remote.of(context), addressesR)
    return balancesR.map(reduce(add, 0))
  }
)

export const getBchBalance = createDeepEqualSelector(
  [
    selectors.core.kvStore.bch.getSpendableContext,
    selectors.core.data.bch.getAddresses
  ],
  (context, addressesR) => {
    const contextToBalances = (context, balances) => context.map(a => pathOr(0, [a, 'final_balance'], balances))
    const balancesR = lift(contextToBalances)(Remote.of(context), addressesR)
    return balancesR.map(reduce(add, 0))
  }
)

export const getEthBalance = selectors.core.data.ethereum.getBalance

export const getWatchOnlyBalances = createDeepEqualSelector(
  [
    selectors.core.wallet.getUnspendableContext,
    selectors.core.data.bitcoin.getAddresses,
    selectors.core.kvStore.bch.getUnspendableContext,
    selectors.core.data.bch.getAddresses
  ],
  (btcContext, btcAddressesR, bchContext, bchAddressesR) => {
    const btcContextToBalances = (context, balances) => context.map(a => pathOr(0, [a, 'final_balance'], balances))
    const bchContextToBalances = (context, balances) => context.map(a => pathOr(0, [a, 'final_balance'], balances))
    const btcBalancesR = lift(btcContextToBalances)(Remote.of(btcContext), btcAddressesR)
    const bchBalancesR = lift(bchContextToBalances)(Remote.of(bchContext), bchAddressesR)
    const transform = (btcBal, bchBal) => {
      return {
        btc: btcBal.reduce(add, 0),
        bch: bchBal.reduce(add, 0)
      }
    }
    return lift(transform)(btcBalancesR, bchBalancesR)
  }
)
