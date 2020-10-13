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
  ExtractSuccess,
  RemoteDataType,
  SBBalanceType
} from 'core/types'
import { coreSelectors, Remote } from 'blockchain-wallet-v4/src'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import { selectors } from 'data'
import { SwapAccountType } from '../exchange/types'
import { SwapCoinType } from './types'

export const getBaseAccount = (state: RootState) =>
  state.components.swap.BASE.account

export const getCounterAccount = (state: RootState) =>
  state.components.swap.COUNTER.account

export const getSide = (state: RootState) => state.components.swap.side

export const getStep = (state: RootState) => state.components.swap.step

const getCustodyBalance = curry((coin: CoinType, state) => {
  return selectors.components.simpleBuy.getSBBalances(state).map(x => x[coin])
})
const generateCustodyAccount = (coin: CoinType, sbBalance?: SBBalanceType) => {
  // hack to support PAX rebrand 🤬
  const ticker = coin === 'PAX' ? 'USD-D' : coin
  return [
    {
      coin,
      label: `${ticker} Trading Wallet`,
      type: ADDRESS_TYPES.CUSTODIAL,
      balance: sbBalance?.available || '0'
    }
  ]
}

const isActive = propEq('archived', false)

export const bchGetActiveAccounts = createDeepEqualSelector(
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

export const btcGetActiveAccounts = createDeepEqualSelector(
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

export const ethGetActiveAccounts = createDeepEqualSelector(
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

export const erc20GetActiveAccounts = createDeepEqualSelector(
  [
    coreSelectors.data.eth.getDefaultAddress,
    (state, token) => coreSelectors.kvStore.eth.getErc20Account(state, token),
    (state, token) => coreSelectors.data.eth.getErc20Balance(state, token),
    (state, token) => getCustodyBalance(token, state),
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

export const xlmGetActiveAccounts = createDeepEqualSelector(
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

// TODO: make dynamic list in future from wallet options getSupportedCoins
export const getActiveAccountsR = state => {
  const accounts = {
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
    BCH: [],
    BTC: [],
    ETH: [],
    PAX: [],
    USDT: [],
    XLM: []
  })

  return activeAccounts
}
