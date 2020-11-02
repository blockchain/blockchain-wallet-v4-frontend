import { RootState } from 'data/rootReducer'

import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'
import {
  any,
  curry,
  lift,
  map,
  path,
  prop,
  propEq,
  toUpper,
  values
} from 'ramda'
import {
  CoinType,
  Erc20CoinsEnum,
  ExtractSuccess,
  RemoteDataType,
  SBBalanceType
} from 'blockchain-wallet-v4/src/types'
import { coreSelectors, Remote } from 'blockchain-wallet-v4/src'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import { getRate } from './utils'
import { selectors } from 'data'
import { SwapAccountType, SwapAmountFormValues, SwapCoinType } from './types'
import BigNumber from 'bignumber.js'

export const getSide = (state: RootState) => state.components.swap.side

export const getStep = (state: RootState) => state.components.swap.step

export const getLimits = (state: RootState) => state.components.swap.limits

export const getOrder = (state: RootState) => state.components.swap.order

export const getPayment = (state: RootState) => state.components.swap.payment

export const getQuote = (state: RootState) => state.components.swap.quote

export const getFix = (state: RootState) => state.components.swap.fix

export const getTradesStatus = (state: RootState) =>
  state.components.swap.trades.status

export const getLatestPendingSwapTrade = (state: RootState) => {
  const trades = state.components.swap.trades.list
  return trades.find(trade => {
    return trade.state === 'PENDING_DEPOSIT'
  })
}

// export const getMaxMin = (
//   coin: CoinType,
//   currency: FiatType,
//   state: RootState
// ) => {
//   const limitsR = state.components.swap.limits
//   const paymentR = state.components.swap.payment
//   const ratesR = selectors.core.data.misc.getRatesSelector(coin, state)

//   return lift(
//     (
//       limits: ExtractSuccess<typeof limitsR>,
//       payment: ExtractSuccess<typeof paymentR>,
//       rates: ExtractSuccess<typeof ratesR>
//     ) => {
//       const effectiveFiatBalance =
//         payment.effectiveBalance * rates[currency].last
//       return Math.min(Number(limits.maxPossibleOrder), effectiveFiatBalance)
//     }
//   )(limitsR, paymentR, ratesR)
// }

export const getIncomingAmount = (state: RootState) => {
  const quoteR = getQuote(state)
  const swapAmountFormValues = selectors.form.getFormValues('swapAmount')(
    state
  ) as SwapAmountFormValues
  const amount = swapAmountFormValues?.cryptoAmount || 1

  return lift(({ quote }: ExtractSuccess<typeof quoteR>) => {
    return new BigNumber(getRate(quote.quote.priceTiers, new BigNumber(amount)))
      .times(amount)
      .toNumber()
  })(quoteR)
}

const getCustodyBalance = curry((coin: CoinType, state) => {
  return selectors.components.simpleBuy.getSBBalances(state).map(x => x[coin])
})
const generateCustodyAccount = (coin: CoinType, sbBalance?: SBBalanceType) => {
  // hack to support PAX rebrand 🤬
  const ticker = coin === 'PAX' ? 'USD-D' : coin
  return [
    {
      baseCoin: coin in Erc20CoinsEnum ? 'ETH' : coin,
      coin,
      label: `${ticker} Trading Wallet`,
      type: ADDRESS_TYPES.CUSTODIAL,
      balance: sbBalance?.available || '0'
    }
  ]
}

const isActive = propEq('archived', false)

const bchGetActiveAccounts = createDeepEqualSelector(
  [
    coreSelectors.wallet.getHDAccounts,
    coreSelectors.data.bch.getAddresses,
    coreSelectors.kvStore.bch.getAccounts,
    getCustodyBalance('BCH')
  ],
  (bchAccounts, bchDataR, bchMetadataR, sbBalanceR) => {
    const transform = (
      bchData,
      bchMetadata,
      sbBalance: ExtractSuccess<typeof sbBalanceR>
    ) =>
      bchAccounts
        .map(acc => {
          const index = prop('index', acc)
          const xpub = prop('xpub', acc)
          const data = prop(xpub, bchData)
          const metadata = bchMetadata[index]

          return {
            archived: prop('archived', metadata),
            baseCoin: 'BCH',
            coin: 'BCH',
            label: prop('label', metadata) || xpub,
            address: index,
            balance: prop('final_balance', data),
            type: ADDRESS_TYPES.ACCOUNT
          }
        })
        .filter(isActive)
        .concat(generateCustodyAccount('BCH', sbBalance))

    return lift(transform)(bchDataR, bchMetadataR, sbBalanceR)
  }
)

const btcGetActiveAccounts = createDeepEqualSelector(
  [
    coreSelectors.wallet.getHDAccounts,
    coreSelectors.data.btc.getAddresses,
    getCustodyBalance('BTC')
  ],
  (btcAccounts, btcDataR, sbBalanceR) => {
    const transform = (
      btcData,
      sbBalance: ExtractSuccess<typeof sbBalanceR>
    ) => {
      return btcAccounts
        .map(acc => ({
          archived: prop('archived', acc),
          baseCoin: 'BTC',
          coin: 'BTC',
          label: prop('label', acc) || prop('xpub', acc),
          address: prop('index', acc),
          // @ts-ignore
          balance: prop('final_balance', prop(prop('xpub', acc), btcData)),
          type: ADDRESS_TYPES.ACCOUNT
        }))
        .filter(isActive)
        .concat(generateCustodyAccount('BTC', sbBalance))
    }

    return lift(transform)(btcDataR, sbBalanceR)
  }
)

const ethGetActiveAccounts = createDeepEqualSelector(
  [
    coreSelectors.data.eth.getAddresses,
    coreSelectors.kvStore.eth.getAccounts,
    getCustodyBalance('ETH')
  ],
  (ethDataR, ethMetadataR, sbBalanceR) => {
    const transform = (
      ethData,
      ethMetadata,
      sbBalance: ExtractSuccess<typeof sbBalanceR>
    ) =>
      ethMetadata
        .map(acc => {
          const address = prop('addr', acc)
          const data = prop(address, ethData)

          return {
            baseCoin: 'ETH',
            coin: 'ETH',
            label: prop('label', acc) || address,
            address,
            balance: prop('balance', data),
            type: ADDRESS_TYPES.ACCOUNT
          }
        })
        .concat(generateCustodyAccount('ETH', sbBalance))

    return lift(transform)(ethDataR, ethMetadataR, sbBalanceR)
  }
)

const erc20GetActiveAccounts = createDeepEqualSelector(
  [
    coreSelectors.data.eth.getDefaultAddress,
    (state, token) => coreSelectors.kvStore.eth.getErc20Account(state, token),
    (state, token) => coreSelectors.data.eth.getErc20Balance(state, token),
    (state, token) => getCustodyBalance(toUpper(token) as CoinType, state),
    (state, token) => token
  ],
  (ethAddressR, erc20AccountR, erc20BalanceR, sbBalanceR, token) => {
    const transform = (
      ethAddress,
      erc20Account,
      erc20Balance,
      sbBalance: ExtractSuccess<typeof sbBalanceR>
    ) =>
      [
        {
          baseCoin: 'ETH',
          coin: toUpper(token),
          label: prop('label', erc20Account),
          address: ethAddress,
          balance: erc20Balance,
          type: ADDRESS_TYPES.ACCOUNT
        }
        // @ts-ignore
      ].concat(generateCustodyAccount(toUpper(token), sbBalance))

    return lift(transform)(
      ethAddressR,
      erc20AccountR,
      erc20BalanceR,
      sbBalanceR
    )
  }
)

const xlmGetActiveAccounts = createDeepEqualSelector(
  [
    coreSelectors.data.xlm.getAccounts,
    coreSelectors.kvStore.xlm.getAccounts,
    getCustodyBalance('XLM')
  ],
  (xlmData, xlmMetadataR, sbBalanceR) => {
    const transform = (
      xlmMetadata,
      sbBalance: ExtractSuccess<typeof sbBalanceR>
    ) =>
      xlmMetadata
        .map(acc => {
          const address = prop('publicKey', acc)
          const account = prop(address, xlmData)
          const noAccount = path(['error', 'message'], account) === 'Not Found'
          const balance = account
            // @ts-ignore
            .map(coreSelectors.data.xlm.selectBalanceFromAccount)
            .getOrElse(0)
          return {
            archived: prop('archived', acc),
            baseCoin: 'XLM',
            coin: 'XLM',
            label: prop('label', acc) || address,
            address,
            balance,
            noAccount,
            type: ADDRESS_TYPES.ACCOUNT
          }
        })
        .filter(isActive)
        .concat(generateCustodyAccount('XLM', sbBalance))

    return lift(transform)(xlmMetadataR, sbBalanceR)
  }
)

const algoGetActiveAccounts = createDeepEqualSelector(
  [getCustodyBalance('ALGO')],
  sbBalanceR => {
    const transform = (sbBalance: ExtractSuccess<typeof sbBalanceR>) =>
      generateCustodyAccount('ALGO', sbBalance)

    return lift(transform)(sbBalanceR)
  }
)

// TODO: make dynamic list in future from wallet options getSupportedCoins
const getActiveAccountsR = state => {
  const accounts = {
    ALGO: algoGetActiveAccounts(state),
    BCH: bchGetActiveAccounts(state),
    BTC: btcGetActiveAccounts(state),
    ETH: ethGetActiveAccounts(state),
    PAX: erc20GetActiveAccounts(state, 'pax'),
    USDT: erc20GetActiveAccounts(state, 'usdt'),
    XLM: xlmGetActiveAccounts(state)
  }

  const isNotLoaded = coinAccounts => Remote.Loading.is(coinAccounts)
  if (any(isNotLoaded, values(accounts))) return Remote.Loading

  return Remote.of(map(coinAccounts => coinAccounts.getOrElse([]), accounts))
}

export const getActiveAccounts = (state: RootState) => {
  const activeAccountsR: RemoteDataType<
    any,
    { [key in SwapCoinType]: Array<SwapAccountType> }
  > = getActiveAccountsR(state)

  const activeAccounts = activeAccountsR.getOrElse({
    ALGO: [],
    BCH: [],
    BTC: [],
    ETH: [],
    PAX: [],
    USDT: [],
    XLM: []
  })

  return activeAccounts
}
