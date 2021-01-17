import {
  any,
  curry,
  lift,
  map,
  path,
  prop,
  propEq,
  toLower,
  values
} from 'ramda'
import BigNumber from 'bignumber.js'

import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'
import { CoinAccountSelectorType, SWAP_COIN_ORDER } from 'coins'
import {
  CoinType,
  Erc20CoinsEnum,
  ExtractSuccess,
  RemoteDataType,
  SBBalanceType
} from 'blockchain-wallet-v4/src/types'
import { coreSelectors, Remote } from 'blockchain-wallet-v4/src'
import { createDeepEqualSelector } from 'services/misc'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

import {
  convertBaseToStandard,
  convertStandardToBase
} from '../exchange/services'
import { getRate } from './utils'
import {
  InitSwapFormValuesType,
  SwapAccountType,
  SwapAmountFormValues,
  SwapCoinType
} from './types'

export const getCustodialEligibility = (state: RootState) =>
  state.components.swap.custodialEligibility

export const getSide = (state: RootState) => state.components.swap.side

export const getStep = (state: RootState) => state.components.swap.step

export const getLimits = (state: RootState) => state.components.swap.limits

export const getOrder = (state: RootState) => state.components.swap.order

export const getPairs = (state: RootState) => state.components.swap.pairs

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

export const getIncomingAmount = (state: RootState) => {
  const quoteR = getQuote(state)
  const initSwapFormValues = selectors.form.getFormValues('initSwap')(
    state
  ) as InitSwapFormValuesType
  const swapAmountFormValues = selectors.form.getFormValues('swapAmount')(
    state
  ) as SwapAmountFormValues
  const amount = swapAmountFormValues?.cryptoAmount || 0
  const fromCoin = initSwapFormValues?.BASE?.coin || 'BTC'
  const toCoin = initSwapFormValues?.COUNTER?.coin || 'BTC'

  return lift(({ quote }: ExtractSuccess<typeof quoteR>) => {
    const amtMinor = convertStandardToBase(fromCoin, amount)
    const exRate = new BigNumber(
      getRate(quote.quote.priceTiers, toCoin, new BigNumber(amtMinor))
    )
    const feeMajor = convertBaseToStandard(toCoin, quote.networkFee)

    const amt = exRate.times(amount).minus(feeMajor)
    const isNegative = amt.isLessThanOrEqualTo(0)

    return {
      amt: isNegative ? 0 : amt,
      isNegative
    }
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

const bchGetActiveAccounts = createDeepEqualSelector(
  [
    coreSelectors.wallet.getHDAccounts, // non-custodial accounts
    coreSelectors.data.bch.getAddresses, // non-custodial xpub info
    coreSelectors.kvStore.bch.getAccounts, // non-custodial metadata info
    coreSelectors.common.bch.getActiveAddresses, // imported addresses
    (state, { coin }) => getCustodyBalance(coin, state), // custodial accounts
    (state, ownProps) => ownProps // selector config
  ],
  (bchAccounts, bchDataR, bchMetadataR, importedAddressesR, sbBalanceR, ownProps) => {
    const transform = (
      bchData,
      bchMetadata,
      importedAddresses,
      sbBalance: ExtractSuccess<typeof sbBalanceR>
    ) => {
      const { coin } = ownProps
      let accounts = []

      // add non-custodial accounts if requested
      if (ownProps?.nonCustodialAccounts) {
        accounts = accounts.concat(bchAccounts
          .map(acc => {
            const index = prop('index', acc)
            const xpub = prop('xpub', acc)
            const data = prop(xpub, bchData)
            const metadata = bchMetadata[index]

            return {
              archived: prop('archived', metadata),
              baseCoin: coin,
              coin,
              label: prop('label', metadata) || xpub,
              address: index,
              balance: prop('final_balance', data),
              type: ADDRESS_TYPES.ACCOUNT
            }
          })
          .filter(propEq('archived', false)))
      }

      // add imported addresses if requested
      if (ownProps?.importedAddresses) {
        accounts = accounts.concat(importedAddresses.map(importedAcc =>({
          address: importedAcc.addr,
          balance: importedAcc.final_balance,
          baseCoin: coin,
          coin,
          label: importedAcc.label,
          type: ADDRESS_TYPES.LEGACY
        })))
      }

      // add custodial accounts if requested
      if (ownProps?.custodialAccounts) {
        // @ts-ignore
        accounts = accounts.concat(generateCustodyAccount(coin, sbBalance as SBBalanceType))
      }

      return accounts
    }

    return lift(transform)(bchDataR, bchMetadataR, importedAddressesR, sbBalanceR)
  }
)

const btcGetActiveAccounts = createDeepEqualSelector(
  [
    coreSelectors.wallet.getHDAccounts, // non-custodial accounts
    coreSelectors.data.btc.getAddresses, // non-custodial xpub info
    coreSelectors.common.btc.getActiveAddresses, // imported addresses
    (state, { coin }) => getCustodyBalance(coin, state), // custodial accounts
    (state, ownProps) => ownProps // selector config
  ],
  (btcAccounts, btcDataR, importedAddressesR, sbBalanceR, ownProps) => {
    const transform = (
      btcData,
      importedAddresses,
      sbBalance: ExtractSuccess<typeof sbBalanceR>
    ) => {
      const { coin } = ownProps
      let accounts = []

      // add non-custodial accounts if requested
      if (ownProps?.nonCustodialAccounts) {
        accounts = accounts.concat(btcAccounts
          .map(acc => ({
            archived: prop('archived', acc),
            baseCoin: coin,
            coin,
            label: prop('label', acc) || prop('xpub', acc),
            accountIndex: prop('index', acc),
            address: prop('index', acc),
            // @ts-ignore
            balance: prop('final_balance', prop(prop('xpub', acc), btcData)),
            type: ADDRESS_TYPES.ACCOUNT
          }))
          .filter(propEq('archived', false)))
      }

      // add imported addresses if requested
      if (ownProps?.importedAddresses) {
        accounts = accounts.concat(importedAddresses.map(importedAcc =>({
          address: importedAcc.addr,
          balance: importedAcc.final_balance,
          baseCoin: coin,
          coin,
          label: importedAcc.label,
          type: ADDRESS_TYPES.LEGACY
        })))
      }

      // add custodial accounts if requested
      if (ownProps?.custodialAccounts) {
        // @ts-ignore
        accounts = accounts.concat(generateCustodyAccount(coin, sbBalance as SBBalanceType))
      }

      return accounts
    }

    return lift(transform)(btcDataR, importedAddressesR, sbBalanceR)
  }
)

// NOT IMPLEMENTED: imported addresses/accounts
const ethGetActiveAccounts = createDeepEqualSelector(
  [
    coreSelectors.data.eth.getAddresses, // non-custodial accounts
    coreSelectors.kvStore.eth.getAccounts, // non-custodial metadata
    (state, { coin }) => getCustodyBalance(coin, state), // custodial accounts
    (state, ownProps) => ownProps // selector config
  ],
  (ethDataR, ethMetadataR, sbBalanceR, ownProps) => {
    const transform = (
      ethData,
      ethMetadata,
      sbBalance: ExtractSuccess<typeof sbBalanceR>
    ) => {
      const { coin } = ownProps
      let accounts = []

      // add non-custodial accounts if requested
      if (ownProps?.nonCustodialAccounts) {
        accounts = accounts.concat(ethMetadata
          .map(acc => {
            const address = prop('addr', acc)
            const data = prop(address, ethData)

            return {
              baseCoin: coin,
              coin,
              label: prop('label', acc) || address,
              address,
              balance: prop('balance', data),
              type: ADDRESS_TYPES.ACCOUNT
            }
          }))
      }

      // add custodial accounts if requested
      if (ownProps?.custodialAccounts) {
        // @ts-ignore
        accounts = accounts.concat(generateCustodyAccount(coin, sbBalance as SBBalanceType))
      }

      return accounts
    }

    return lift(transform)(ethDataR, ethMetadataR, sbBalanceR)
  }
)

// NOT IMPLEMENTED: imported addresses/accounts
const erc20GetActiveAccounts = createDeepEqualSelector(
  [
    coreSelectors.data.eth.getDefaultAddress,
    (state, { coin }) => coreSelectors.kvStore.eth.getErc20Account(state, toLower(coin) as CoinType), // non-custodial accounts
    (state, { coin }) => coreSelectors.data.eth.getErc20Balance(state, toLower(coin) as CoinType), // non-custodial metadata
    (state, { coin }) => getCustodyBalance(coin, state), // custodial accounts
    (state, ownProps) => ownProps // selector config
  ],
  (ethAddressR, erc20AccountR, erc20BalanceR, sbBalanceR, ownProps) => {
    const transform = (
      ethAddress,
      erc20Account,
      erc20Balance,
      sbBalance: ExtractSuccess<typeof sbBalanceR>
    ) => {
      const { coin } = ownProps
      let accounts = []

      // add non-custodial accounts if requested
      if (ownProps?.nonCustodialAccounts) {
        // @ts-ignore
        accounts = accounts.concat([{
          baseCoin: 'ETH',
          coin,
          label: prop('label', erc20Account),
          address: ethAddress,
          balance: erc20Balance,
          type: ADDRESS_TYPES.ACCOUNT
        }])
      }

      // add custodial accounts if requested
      if (ownProps?.custodialAccounts) {
        // @ts-ignore
        accounts = accounts.concat(generateCustodyAccount(coin, sbBalance as SBBalanceType))
      }
      return accounts
    }

    return lift(transform)(
      ethAddressR,
      erc20AccountR,
      erc20BalanceR,
      sbBalanceR
    )
  }
)

// NOT IMPLEMENTED: imported addresses/accounts
const xlmGetActiveAccounts = createDeepEqualSelector(
  [
    coreSelectors.data.xlm.getAccounts, // non-custodial accounts
    coreSelectors.kvStore.xlm.getAccounts, // non-custodial metadata
    (state, { coin }) => getCustodyBalance(coin, state), // custodial accounts
    (state, ownProps) => ownProps // selector config
  ],
  (xlmData, xlmMetadataR, sbBalanceR, ownProps) => {
    const transform = (
      xlmMetadata,
      sbBalance: ExtractSuccess<typeof sbBalanceR>
    ) => {
      const { coin } = ownProps
      let accounts = []

      // add non-custodial accounts if requested
      if (ownProps?.nonCustodialAccounts) {
        accounts = accounts.concat(xlmMetadata
          .map(acc => {
            const address = prop('publicKey', acc)
            const account = prop(address, xlmData)
            const noAccount = path(['error', 'message'], account) === 'Not Found'
            const balance = convertStandardToBase(
              coin,
              account
                // @ts-ignore
                .map(coreSelectors.data.xlm.selectBalanceFromAccount)
                .getOrElse(0)
            )
            return {
              archived: prop('archived', acc),
              baseCoin: coin,
              coin,
              label: prop('label', acc) || address,
              address,
              balance,
              noAccount,
              type: ADDRESS_TYPES.ACCOUNT
            }
          })
          .filter(propEq('archived', false)))
      }

      // add custodial accounts if requested
      if (ownProps?.custodialAccounts) {
        // @ts-ignore
        accounts = accounts.concat(generateCustodyAccount(coin, sbBalance as SBBalanceType))
      }

      return accounts
    }

    return lift(transform)(xlmMetadataR, sbBalanceR)
  }
)

// NOT IMPLEMENTED: non-custodial accounts
// NOT IMPLEMENTED: imported addresses/accounts
const algoGetActiveAccounts = createDeepEqualSelector(
  [
    (state, { coin }) => getCustodyBalance(coin, state), // custodial accounts
    (state, ownProps) => ownProps // selector config
  ],
  (sbBalanceR, ownProps) => {
    const transform = (sbBalance: ExtractSuccess<typeof sbBalanceR>) => {
      const { coin } = ownProps
      let accounts = []

      // add custodial accounts if requested
      if (ownProps?.custodialAccounts) {
        // @ts-ignore
        accounts = accounts.concat(generateCustodyAccount(coin, sbBalance as SBBalanceType))
      }

      return accounts
    }

    return lift(transform)(sbBalanceR)
  }
)

export const getActiveAccounts = (state: RootState, ownProps: CoinAccountSelectorType) => {
  const getActiveAccountsR = state => {
    const accounts = {
      ALGO: algoGetActiveAccounts(state, { coin: 'ALGO', ...ownProps }),
      BCH: bchGetActiveAccounts(state, { coin: 'BCH', ...ownProps }),
      BTC: btcGetActiveAccounts(state, { coin: 'BTC', ...ownProps }),
      ETH: ethGetActiveAccounts(state, { coin: 'ETH', ...ownProps }),
      PAX: erc20GetActiveAccounts(state, { coin: 'PAX', ...ownProps }),
      USDT: erc20GetActiveAccounts(state, { coin: 'USDT', ...ownProps }),
      XLM: xlmGetActiveAccounts(state, { coin: 'XLM', ...ownProps }),
      WDGLD: erc20GetActiveAccounts(state, { coin: 'WDGLD', ...ownProps })
    }

    const isNotLoaded = coinAccounts => Remote.Loading.is(coinAccounts)
    if (any(isNotLoaded, values(accounts))) return Remote.Loading

    return Remote.of(map(coinAccounts => coinAccounts.getOrElse([]), accounts))
  }

  const activeAccountsR: RemoteDataType<
    any,
    { [key in SwapCoinType]: Array<SwapAccountType> }
  > = getActiveAccountsR(state)

  // @ts-ignore
  const activeAccounts = activeAccountsR.getOrElse(SWAP_COIN_ORDER
    .reduce((result, item) => {
      result[item] = []
      return result
    }, {})
  )

  return activeAccounts
}


// TODO LIST
// - move account specific stuff into new coins folder
// - dynamic selectors based on only what was requested
// - fix ts-ignores
// - remove hardcoded coinlist (getActiveAccountsR), create map for selectors